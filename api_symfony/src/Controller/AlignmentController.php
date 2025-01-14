<?php

namespace App\Controller;

use App\Repository\AlignmentRepository;
use Doctrine\DBAL\Connection;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AlignmentController extends AbstractController
{
    #[Route('/api/search', name: 'search', methods: ['POST'])]
    public function search(Request $request, Connection $connection): JsonResponse
    {
        // Accéder au cookie
        $token = $request->cookies->get('token');

        if (!$token) {
            return new JsonResponse(['error' => 'Token not found'], 401);
        }

        // Décoder le token pour obtenir l'utilisateur connecté
        try {
            $secretKey = $_ENV['JWT_SECRET'];
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userId = $decodedToken->sub; // Assurez-vous que le token contient un champ 'sub' avec l'ID utilisateur
            $role = $decodedToken->role;
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid token'], 401);
        }

        $content = $request->getContent();

        // Décoder le JSON en tableau PHP
        $data = json_decode($content, true);

        $sourceContent = '%' . $data['source_content'] . '%';
        $sourceAuthor = '%' . $data['source_author'] . '%';
        $sourceTitle = '%' . $data['source_title'] . '%';
        $sourceYear = '%' . $data['source_year'] . '%';
        $sourceGenre = '%' . $data['source_genre'] . '%';
        $targetContent = '%' . $data['target_content'] . '%';
        $targetAuthor = '%' . $data['target_author'] . '%';
        $targetTitle = '%' . $data['target_title'] . '%';
        $targetYear = '%' . $data['target_year'] . '%';
        $targetGenre = '%' . $data['target_genre'] . '%';
        $userId = $decodedToken->sub;

        // Récupération du dernier ID de la page précédente (curseur)
        $lastId = (int) $data['lastId'];

        $sql = "SELECT alignment.id as ID, 
            alignment.source_before,
            SUBSTRING(alignment.source_content, 1, 1500) AS source_content, -- Limiter à 1500 caractères
            alignment.source_after,
            alignment.source_author,
            alignment.source_title,
            alignment.source_year,
            alignment.source_length,
            alignment.source_genre,
            alignment.target_author,
            alignment.target_before,
            SUBSTRING(alignment.target_content, 1, 1500) AS target_content, -- Limiter à 1500 caractères
            alignment.target_after,
            alignment.target_title, 
            alignment.target_year,
            alignment.target_length,
            alignment.target_genre,
            evaluation.* 
            FROM alignment 
            LEFT JOIN evaluation ON evaluation.alignment_id = alignment.id 
            WHERE alignment.id > ? AND
            source_content LIKE ? AND
            source_author LIKE ? AND 
            source_title LIKE ? AND
            source_year LIKE ? AND
            source_genre LIKE ? AND
            target_content LIKE ? AND
            target_author LIKE ? AND 
            target_title LIKE ? AND
            target_year LIKE ? AND 
            target_genre LIKE ? AND
            (evaluation.user_id = ? OR evaluation.user_id IS NULL)
            AND alignment.id NOT IN (
                SELECT alignment_id 
                FROM evaluation 
                WHERE user_id != ?
            )
            ORDER BY alignment.id ASC
            LIMIT 50";

        $sqlAll = "SELECT alignment.id as ID,  
            SUBSTRING(alignment.source_content, 1, 50) AS source_content, -- Limiter à 50 caractères
            SUBSTRING(alignment.target_content, 1, 50) AS target_content, -- Limiter à 50 caractères
            SUBSTRING(alignment.source_author, 1, 30) AS source_author,
            SUBSTRING(alignment.source_title, 1, 30) AS source_title,
            alignment.source_year,
            alignment.source_length,
            alignment.source_genre,
            SUBSTRING(alignment.target_author, 1, 30) AS target_author,
            SUBSTRING(alignment.target_title, 1, 30) As target_title,
            alignment.target_year,
            alignment.target_length,
            alignment.target_genre,
            evaluation.* 
            FROM alignment 
            LEFT JOIN evaluation ON evaluation.alignment_id = alignment.id 
            WHERE alignment.id > ? AND
            source_content LIKE ? AND
            source_author LIKE ? AND 
            source_title LIKE ? AND
            source_year LIKE ? AND
            source_genre LIKE ? AND
            target_content LIKE ? AND
            target_author LIKE ? AND 
            target_title LIKE ? AND
            target_year LIKE ? AND 
            target_genre LIKE ? AND
            (evaluation.user_id = ? OR evaluation.user_id IS NULL)
            AND alignment.id NOT IN (
                SELECT alignment_id 
                FROM evaluation 
                WHERE user_id != ?
            )
            ORDER BY alignment.id ASC";

        // Requête SQL pour récupérer le nombre total d'enregistrements
        $countSql = "SELECT COUNT(*) as total_count
            FROM alignment 
            LEFT JOIN evaluation ON evaluation.alignment_id = alignment.id 
            WHERE 
            source_content LIKE ? AND
            source_author LIKE ? AND 
            source_title LIKE ? AND
            source_year LIKE ? AND
            source_genre LIKE ? AND
            target_content LIKE ? AND
            target_author LIKE ? AND 
            target_title LIKE ? AND
            target_year LIKE ? AND 
            target_genre LIKE ? AND
            (evaluation.user_id = ? OR evaluation.user_id IS NULL)
            AND alignment.id NOT IN (
                SELECT alignment_id 
                FROM evaluation 
                WHERE user_id != ?
            )";

        $values = [
            $sourceContent,
            $sourceAuthor,
            $sourceTitle,
            $sourceYear,
            $sourceGenre,
            $targetContent,
            $targetAuthor,
            $targetTitle,
            $targetYear,
            $targetGenre,
            $userId,
            $userId
        ];

        try {
            // Exécution de la requête pour récupérer le nombre total d'enregistrements
            $totalCountResult = $connection->fetchOne($countSql, $values, array_fill(0, count($values), \PDO::PARAM_STR));
            $totalCount = (int) $totalCountResult;

            // Exécution de la requête pour les résultats paginés
            $values = array_merge([$lastId], $values);
            $results = $connection->fetchAllAssociative(
                $sql,
                $values,
                array_merge([\PDO::PARAM_INT], array_fill(0, count($values) - 2, \PDO::PARAM_STR), [\PDO::PARAM_INT])
            );

            $resultsAll = $connection->fetchAllAssociative(
                $sqlAll,
                $values,
                array_merge([\PDO::PARAM_INT], array_fill(0, count($values) - 2, \PDO::PARAM_STR), [\PDO::PARAM_INT])
            );

            if (!empty($results)) {
                error_log('Query returned IDs: ' . implode(', ', array_column($results, 'ID')));
            } else {
                error_log('Query returned no results');
            }


            if ($lastId == 0) {

                // Étape 2: Compter les occurrences pour chaque champ individuellement
                $fieldCounts = [
                    'source passage' => [],
                    'source auteur' => [],
                    'source titre' => [],
                    'source année' => [],
                    'source longueur' => [],
                    'source genre' => [],
                    'cible passage' => [],
                    'cible auteur' => [],
                    'cible titre' => [],
                    'cible année' => [],
                    'cible longueur' => [],
                    'cible genre' => []
                ];

                // Parcourir chaque résultat et compter les occurrences de chaque champ
                foreach ($resultsAll as $result) {


                    // Compter les occurrences de 'source_content'
                    if (!isset($fieldCounts['source passage'][$result['source_content']])) {
                        $fieldCounts['source passage'][$result['source_content']] = ['value' => $result['source_content'], 'count' => 0];
                    }
                    $fieldCounts['source passage'][$result['source_content']]['count']++;

                    // Compter les occurrences de 'source_author'
                    if (!isset($fieldCounts['source auteur'][$result['source_author']])) {
                        $fieldCounts['source auteur'][$result['source_author']] = ['value' => $result['source_author'], 'count' => 0];
                    }
                    $fieldCounts['source auteur'][$result['source_author']]['count']++;

                    // Compter les occurrences de 'source_title'
                    if (!isset($fieldCounts['source titre'][$result['source_title']])) {
                        $fieldCounts['source titre'][$result['source_title']] = ['value' => $result['source_title'], 'count' => 0];
                    }
                    $fieldCounts['source titre'][$result['source_title']]['count']++;

                    // Compter les occurrences de 'source_year'
                    if (!isset($fieldCounts['source année'][$result['source_year']])) {
                        $fieldCounts['source année'][$result['source_year']] = ['value' => $result['source_year'], 'count' => 0];
                    }
                    $fieldCounts['source année'][$result['source_year']]['count']++;

                    if (isset($result['source_length'])) {
                        // Calculer la plage d'intervalle (de 0-100, 101-200, etc.)
                        $length = (int) $result['source_length'];
                        $rangeStart = (int) floor($length / 1000) * 1000;
                        $rangeEnd = $rangeStart + 1000;

                        // Créer une clé pour l'intervalle, par exemple "0-100", "101-200", etc.
                        $rangeKey = $rangeStart . '-' . $rangeEnd;

                        // Vérifier si cette plage existe déjà dans les comptes
                        if (!isset($fieldCounts['source longueur'][$rangeKey])) {
                            $fieldCounts['source longueur'][$rangeKey] = ['value' => $rangeKey, 'count' => 0];
                        }
                        $fieldCounts['source longueur'][$rangeKey]['count']++;
                    }

                     // Compter les occurrences de 'source_genre'
                     if (!isset($fieldCounts['source genre'][$result['source_genre']])) {
                        $fieldCounts['source genre'][$result['source_genre']] = ['value' => $result['source_genre'], 'count' => 0];
                    }
                    $fieldCounts['source genre'][$result['source_genre']]['count']++;

                    // Compter les occurrences de 'target_content'
                    if (!isset($fieldCounts['cible passage'][$result['target_content']])) {
                        $fieldCounts['cible passage'][$result['target_content']] = ['value' => $result['target_content'], 'count' => 0];
                    }
                    $fieldCounts['cible passage'][$result['target_content']]['count']++;

                    // Compter les occurrences de 'target_author'
                    if (!isset($fieldCounts['cible auteur'][$result['target_author']])) {
                        $fieldCounts['cible auteur'][$result['target_author']] = ['value' => $result['target_author'], 'count' => 0];
                    }
                    $fieldCounts['cible auteur'][$result['target_author']]['count']++;

                    // Compter les occurrences de 'target_title'
                    if (!isset($fieldCounts['cible titre'][$result['target_title']])) {
                        $fieldCounts['cible titre'][$result['target_title']] = ['value' => $result['target_title'], 'count' => 0];
                    }
                    $fieldCounts['cible titre'][$result['target_title']]['count']++;

                    // Compter les occurrences de 'target_year'
                    if (!isset($fieldCounts['cible année'][$result['target_year']])) {
                        $fieldCounts['cible année'][$result['target_year']] = ['value' => $result['target_year'], 'count' => 0];
                    }
                    $fieldCounts['cible année'][$result['target_year']]['count']++;

                    

                    if (isset($result['target_length'])) {
                        // Calculer la plage d'intervalle (de 0-100, 101-200, etc.)
                        $length = (int) $result['target_length'];
                        $rangeStart = (int) floor($length / 1000) * 1000;
                        $rangeEnd = $rangeStart + 1000;

                        // Créer une clé pour l'intervalle, par exemple "0-100", "101-200", etc.
                        $rangeKey = $rangeStart . '-' . $rangeEnd;

                        // Vérifier si cette plage existe déjà dans les comptes
                        if (!isset($fieldCounts['cible longueur'][$rangeKey])) {
                            $fieldCounts['cible longueur'][$rangeKey] = ['value' => $rangeKey, 'count' => 0];
                        }
                        $fieldCounts['cible longueur'][$rangeKey]['count']++;
                    }

                    // Compter les occurrences de 'target_genre'
                    if (!isset($fieldCounts['cible genre'][$result['target_genre']])) {
                        $fieldCounts['cible genre'][$result['target_genre']] = ['value' => $result['target_genre'], 'count' => 0];
                    }
                    $fieldCounts['cible genre'][$result['target_genre']]['count']++;
                }



                // Transformer chaque ensemble de valeurs en un tableau d'objets
                foreach ($fieldCounts as $field => $values) {
                    $fieldCounts[$field] = array_values($values); // Extraire les objets dans un tableau indexé
                }

                return new JsonResponse([
                    'total_count' => $totalCount,
                    'results' => $results,
                    'grouped_results' => $fieldCounts,  // Les comptes de chaque champ // Les résultats groupés après regroupement
                    'lastId' => $lastId,
                    'role' => $role
                ]);
            }



            return new JsonResponse([
                'total_count' => $totalCount,
                'results' => $results,
                // 'grouped_results' => $fieldCounts,  // Les comptes de chaque champ // Les résultats groupés après regroupement
                'lastId' => $lastId,
                'role' => $role
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    // Get alignments count
    #[Route('/api/alignment/count', name: 'app_alignment_count')]
    public function count(AlignmentRepository $alignmentRepository)
    {
        $count = $alignmentRepository->count();
        return new JsonResponse($count);
    }

    #[Route('/api/alignment/groupe', name: 'app_alignment_groupe')]
    public function groupe(Request $request, Connection $connection)
    {
        // Accéder au cookie
        $token = $request->cookies->get('token');

        if (!$token) {
            return new JsonResponse(['error' => 'Token not found'], 401);
        }

        // Décoder le token pour obtenir l'utilisateur connecté
        try {
            $secretKey = $_ENV['JWT_SECRET'];
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userId = $decodedToken->sub; // Assurez-vous que le token contient un champ 'sub' avec l'ID utilisateur
            $role = $decodedToken->role;
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid token'], 401);
        }

        // Décoder le JSON en tableau PHP
        $content = $request->getContent();
        $data = json_decode($content, true);

        // Valider les champs attendus dans la requête
        $sourceContent = isset($data['source_content']) ? '%' . $data['source_content'] . '%' : '%%';
        $sourceAuthor = isset($data['source_author']) ? '%' . $data['source_author'] . '%' : '%%';
        $sourceTitle = isset($data['source_title']) ? '%' . $data['source_title'] . '%' : '%%';
        $sourceYear = isset($data['source_year']) ? '%' . $data['source_year'] . '%' : '%%';
        $targetContent = isset($data['target_content']) ? '%' . $data['target_content'] . '%' : '%%';
        $targetAuthor = isset($data['target_author']) ? '%' . $data['target_author'] . '%' : '%%';
        $targetTitle = isset($data['target_title']) ? '%' . $data['target_title'] . '%' : '%%';
        $targetYear = isset($data['target_year']) ? '%' . $data['target_year'] . '%' : '%%';

        // Construire la requête SQL avec le regroupement
        $sql = "SELECT 
    SUBSTRING(alignment.source_content, 1, 50) AS source_content, -- Limiter à 50 caractères
    COUNT(*) AS occurrences  -- Compter le nombre d'occurrences de chaque source_content
FROM alignment 
LEFT JOIN evaluation ON evaluation.alignment_id = alignment.id 
WHERE alignment.id > 0
AND source_content LIKE ? 
AND source_author LIKE ? 
AND source_title LIKE ? 
AND source_year LIKE ? 
AND target_content LIKE ? 
AND target_author LIKE ? 
AND target_title LIKE ? 
AND target_year LIKE ? 
AND (evaluation.user_id = ? OR evaluation.user_id IS NULL)
AND alignment.id NOT IN (
    SELECT alignment_id 
    FROM evaluation 
    WHERE user_id != ?
)
GROUP BY alignment.source_content;
";


        // Les paramètres pour la requête
        $values = [
            $sourceContent,
            $sourceAuthor,
            $sourceTitle,
            $sourceYear,
            $targetContent,
            $targetAuthor,
            $targetTitle,
            $targetYear,
            $userId,
            $userId
        ];

        try {
            $results = $connection->fetchAllAssociative(
                $sql,
                $values,
                array_fill(0, count($values), \PDO::PARAM_STR)
            );

            return new JsonResponse($results);
        } catch (\Exception $e) {
            // Afficher l'erreur exacte dans le log et la réponse
            error_log($e->getMessage());  // Ajouter au log serveur
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
