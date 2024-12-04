import React, { useState, useEffect, useRef } from 'react';

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function Rapport() {
    const [evaluated, setEvaluated] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [countEvaluated, setCountEvaluated] = useState(0)
    const [countValidated, setCountValidated] = useState(0)
    const [countAlignment, setCountAlignment] = useState(0)
    const [countDownloded, setCountDownloded] = useState(0)
    const [countSourceAuthor, setCountSourceAuthor] = useState(0)
    const [countTargetAuthor, setCountTargetAuthor] = useState(0)
    const [isDownloaded, setIsDownloaded] = useState(false)
    // Utilisation d'AbortController pour annuler les requêtes en cours
    const abortControllerRef = useRef(null);

    const getCount = async () => {
        setIsLoading(true)
        const response = await fetch(`${ENDPOINT}/admin/rapport/count`, {
            method: 'GET', // Méthode HTTP
            headers: {
                'Content-Type': 'application/json', // Indiquer le type de contenu attendu par l'API
            },
            credentials: 'include'  // Envoyer les cookies avec la requête
        })
        if (response.ok) {
            const data = await response.json()
            animateCounter(data.evaluated, data.validated, data.alignment, data.sourceAuthor, data.targetAuthor)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getCount();

        // Cleanup pour arrêter les requêtes en cours lorsque le composant est démonté ou que l'utilisateur quitte la page
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();  // Annuler les requêtes en cours
            }
        };
    }, []);

    // Fonction générique pour récupérer les données par lot et les exporter en CSV
    const fetchDataInBatches = async (endpoint, fileName) => {
        setIsLoading(true);
        setCountDownloded(0)
        let lastId = 0;
        const limit = 1000;  // Nombre de lignes à récupérer par lot
        let allData = [];
        let batchCount = 0;
        let filePart = 1;    // Numéro de fichier
        const maxRecordsPerFile = 10000;  // Maximum d'enregistrements par fichier

        // Créer un nouvel AbortController pour cette série de requêtes
        abortControllerRef.current = new AbortController();
        const controller = abortControllerRef.current;

        try {
            while (true) {
                batchCount++;
                const response = await fetch(`${ENDPOINT}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ limit, lastId }),  // Envoyer lastId au backend
                    signal: controller.signal,  // Associer le signal à la requête
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCountDownloded((prevCount) => prevCount + data.length)
                    setIsDownloaded(true)
                    // Ajouter les données récupérées à allData
                    allData = allData.concat(data);

                    // Si le nombre d'enregistrements récupérés est inférieur à la limite, arrêter la boucle
                    if (data.length < limit) {
                        // Exporter le dernier lot si des enregistrements restent
                        if (allData.length > 0) {
                            const currentFileName = `${fileName}_part${filePart}.csv`;
                            downloadCSV(allData, currentFileName);  // Exporter le fichier
                            filePart++;  // Incrémenter le numéro du fichier
                        }
                        break;
                    }

                    // Définir lastId comme l'ID du dernier élément du lot actuel
                    lastId = data[data.length - 1].id;

                    // Si le nombre total d'enregistrements dépasse 10 000, exporter et réinitialiser allData
                    if (allData.length >= maxRecordsPerFile) {
                        const currentFileName = `${fileName}_part${filePart}.csv`;
                        downloadCSV(allData.slice(0, maxRecordsPerFile), currentFileName);  // Exporter le fichier
                        filePart++;  // Incrémenter le numéro du fichier

                        // Réinitialiser allData avec les enregistrements restants (s'il y en a plus de 10 000)
                        allData = allData.slice(maxRecordsPerFile);
                    }
                } else {
                    console.error("Erreur lors de la récupération des données.");
                    break;
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Le téléchargement des données a été interrompu.');
            } else {
                console.error('Erreur inconnue lors du téléchargement des données.', err);
            }
        } finally {
            setIsLoading(false);
            setIsDownloaded(false)
        }
    };


    const getEvaluatedInBatches = () => {
        fetchDataInBatches('/admin/rapport/evaluated', 'evaluated.csv');
    };

    const getValidatedInBatches = () => {
        fetchDataInBatches('/admin/rapport/validated', 'validated.csv');
    };

    const getAlignmentInBatches = () => {
        fetchDataInBatches('/admin/rapport/alignment', 'alignment.csv');
    };

    const getSourceAuthorInBatches = async () => {
        setIsLoading(true)
        // fetchDataInBatches('/admin/rapport/author_source', 'source_author.csv');
        const response = await fetch(`${ENDPOINT}/admin/rapport/author_source`, {
            credentials: 'include'
        })
        const data = await response.json()
        setIsLoading(false)
        downloadCSV(data, 'author_source.csv')
    };

    const getTargetAuthorInBatches = async () => {
        setIsLoading(true)
        // fetchDataInBatches('/admin/rapport/author_target', 'target_author.csv');
        const response = await fetch(`${ENDPOINT}/admin/rapport/author_target`, {
            credentials: 'include'
        })
        const data = await response.json()
        setIsLoading(false)
        downloadCSV(data, 'author_target.csv')
    };

    // Fonction d'animation pour incrémenter la valeur du compteur
    const animateCounter = (evaluated, validated, alignment, sourceAuthor, targetAuthor) => {
        let currentValue1 = 0;
        let currentValue2 = 0;
        let currentValue3 = 0;
        let currentValue4 = 0;
        let currentValue5 = 0;


        const increment1 = Math.ceil(evaluated / 100); // Divisez pour que ça monte en 100 étapes
        const increment2 = Math.ceil(validated / 100); // Divisez pour que ça monte en 100 étapes
        const increment3 = Math.ceil(alignment / 100); // Divisez pour que ça monte en 100 étapes
        const increment4 = Math.ceil(sourceAuthor / 100); // Divisez pour que ça monte en 100 étapes
        const increment5 = Math.ceil(targetAuthor / 100); // Divisez pour que ça monte en 100 étapes


        // Interval pour countEvaluated
        const interval1 = setInterval(() => {
            currentValue1 += increment1;
            if (currentValue1 >= evaluated) {
                setCountEvaluated(evaluated);
                clearInterval(interval1); // Arrêter une fois la valeur atteinte
            } else {
                setCountEvaluated(currentValue1);
            }
        }, 20);

        // Interval pour countValidated
        const interval2 = setInterval(() => {
            currentValue2 += increment2;
            if (currentValue2 >= validated) {
                setCountValidated(validated);
                clearInterval(interval2); // Arrêter une fois la valeur atteinte
            } else {
                setCountValidated(currentValue2);
            }
        }, 20);

        // Interval pour countAlignment
        const interval3 = setInterval(() => {
            currentValue3 += increment3;
            if (currentValue3 >= alignment) {
                setCountAlignment(alignment);
                clearInterval(interval3); // Arrêter une fois la valeur atteinte
            } else {
                setCountAlignment(currentValue3);
            }
        }, 20);

        // Interval pour countSourceAuthor
        const interval4 = setInterval(() => {
            currentValue4 += increment4;
            if (currentValue4 >= sourceAuthor) {
                setCountSourceAuthor(sourceAuthor);
                clearInterval(interval4); // Arrêter une fois la valeur atteinte
            } else {
                setCountSourceAuthor(currentValue4);
            }
        }, 20);

        // Interval pour countTargetAuthor
        const interval5 = setInterval(() => {
            currentValue5 += increment5;
            if (currentValue5 >= targetAuthor) {
                setCountTargetAuthor(targetAuthor);
                clearInterval(interval5); // Arrêter une fois la valeur atteinte
            } else {
                setCountTargetAuthor(currentValue5);
            }
        }, 20);
    };

    // Fonction pour convertir les données en CSV
    const convertToCSV = (objArray) => {
        if (!objArray || objArray.length === 0) {
            console.error("No data available to convert to CSV");
            return '';
        }

        const array = [Object.keys(objArray[0])].concat(objArray);

        return array.map(row => {
            return Object.values(row).join(",");
        }).join("\n");
    };

    // Fonction pour télécharger le CSV
    const downloadCSV = (data, filename) => {
        const csvData = convertToCSV(data);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        // Créer un lien de téléchargement et cliquer dessus
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="xl:ml-64 max-xl:ml-24">
            <div className="p-6 bg-gray-100">
                <h1 className="text-3xl font-bold">Rapport</h1>
            </div>
            {isLoading && <div className='flex flex-col gap-3 items-center'>
                <span className="loading loading-bars loading-lg text-accent block m-auto"></span>
                {isDownloaded && <span className='text-2xl text-red-400'>Lot récupéré: {countDownloded} enregistrements</span>}
            </div>}
            <div className='p-5 flex gap-6 flex-wrap justify-around'>
                <div className='flex my-5'>
                    <div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
                        <h2 className='text-6xl '>{countAlignment}</h2>
                        <h2 className='text-xl '>Alignements</h2>
                        <button onClick={getAlignmentInBatches} className="btn btn-warning font-bold py-2 px-4 rounded">
                            Exporter en CSV
                        </button>
                    </div>
                </div>
                <div className='flex my-5 '>
                    <div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
                        <h2 className='text-6xl '>{countEvaluated}</h2>
                        <h2 className='text-xl '>Alignements évalués</h2>
                        <button onClick={getEvaluatedInBatches} className="btn btn-warning font-bold py-2 px-4 rounded">
                            Exporter en CSV
                        </button>
                    </div>
                </div>
                {/* <div className='flex my-5'>
                    <div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
                        <h2 className='text-6xl '>{countValidated}</h2>
                        <h2 className='text-xl '>Alignements validés</h2>
                        <button onClick={getValidatedInBatches} className="btn btn-warning font-bold py-2 px-4 rounded">
                            Exporter en CSV
                        </button>
                    </div>
                </div> */}
            </div>
            <div className='p-5 flex gap-6 flex-wrap justify-around'>
                <div className='flex my-5'>
                    <div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
                        <h2 className='text-6xl '>{countSourceAuthor}</h2>
                        <h2 className='text-xl '>Auteurs Sources</h2>
                        <button onClick={getSourceAuthorInBatches} className="btn btn-warning font-bold py-2 px-4 rounded">
                            Exporter en CSV
                        </button>
                    </div>
                </div>

                <div className='flex my-5'>
                    <div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
                        <h2 className='text-6xl '>{countTargetAuthor}</h2>
                        <h2 className='text-xl '>Auteurs Cibles</h2>
                        <button onClick={getTargetAuthorInBatches} className="btn btn-warning font-bold py-2 px-4 rounded">
                            Exporter en CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
