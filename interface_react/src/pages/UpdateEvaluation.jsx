import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Modal from "../component/Modal";
import { Navigate } from "react-router-dom";

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function UpdateEvaluation() {
    const [paragraphs, setParagraphs] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [lastId, setLastId] = useState(null); // Start with null for better control
    const [currentPage, setCurrentPage] = useState(0); // Page actuelle
    const itemsPerPage = 50; // Nombre d'éléments par page
    const [pageIds, setPageIds] = useState([0]); // Initial pageIds starts with 0 for first page
    const [isOpen, setIsOpen] = useState(false)
    const role = localStorage.getItem('role')
    // Fonction pour récupérer les résultats
    const fetchResults = async (id = 0) => {
        setIsLoading(true);

        const response = await fetch(`${ENDPOINT}/evaluation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lastId: id }), // Passer le dernier ID pour récupérer les éléments suivants
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                
                setCount(data.count); // Mettre à jour le nombre total d'alignements
                setParagraphs(data.results); // Mettre à jour les paragraphes affichés
                setLastId(data.lastId);
            }
        }
        setIsLoading(false);
    };

    // Fonction pour gérer le clic sur les numéros de page
    const handlePageClick = async (event) => {
        const selectedPage = event.selected;
        if (selectedPage > currentPage) {
            // Aller à la page suivante
            setPageIds((prev) => [...prev, lastId]);
            fetchResults(lastId);
            
        } else if (selectedPage < currentPage && pageIds.length > 1) {
            // Aller à la page précédente
            const prevLastId = pageIds[pageIds.length - 2]; // ID de la page précédente
            setLastId(prevLastId); // Mettre à jour le lastId avec l'avant-dernier ID
            setPageIds((prev) => prev.slice(0, -1)); // Supprimer le dernier élément de pageIds
            fetchResults(prevLastId);
        }

        setCurrentPage(selectedPage); // Mettre à jour la page courante


    };

    // Charger les 10 premiers enregistrements lors du premier montage du composant
    useEffect(() => {
        fetchResults(0); // Charger la première page (ID = 0)
    }, []); // Exécuter uniquement au premier montage



    // Fonction pour gérer la suppression d'une évaluation
    const handleDelete = async (id) => {
        localStorage.setItem('evaluation_id', id)
        setIsOpen(true)
    };

    const confirmDelete = async () => {
        const id = localStorage.getItem('evaluation_id')
        const response = await fetch(`${ENDPOINT}/evaluation/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setIsOpen(false)
            await fetchResults(0); // Recharger les résultats après la suppression
        }
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // Afficher uniquement les éléments de la page actuelle
    const currentItems = paragraphs.slice(0, itemsPerPage);

    const pageCount = Math.ceil(count / itemsPerPage); // In your case, this will be 12
    const validCurrentPage = currentPage >= pageCount ? pageCount - 1 : currentPage; // Ensure valid current Page
    // Redirection vers la page de login si l'utilisateur n'est pas authentifié
    if (role !== 'Annotateur') {
        return <Navigate to={'/login'} />;
    }
    return (
        <div className="p-5 m-5 relative">
            {isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto absolute left-1/2"></span>}
            <h2 className="py-2 px-3 mb-3 bg-black text-white text-center rounded">
                {count} Alignements Évalués par {localStorage.getItem('email')}
            </h2>
            <div className="flex mb-3 pb-3 border-b-4">
                <div className="font-bold w-5/12">Source Contexte</div>
                <div className="font-bold w-5/12">Cible Contexte</div>
                <div className="font-bold w-2/12 text-center">ACTION</div>
            </div>
            {currentItems.length > 0 && currentItems.map((text, id) => (
                <div key={id}>
                    <div className="flex gap-5 my-2 shadow items-center">
                        <div className="w-5/12 text-justify">
                                {text.source_before}
                        </div>
                        <div className="w-5/12 text-justify">
                                {text.target_before}
                        </div>
                        <div className="w-2/12 flex justify-center items-center">
                            <button className="btn btn-outline btn-error btn-sm" onClick={() => { handleDelete(text.evaluation_id) }}>
                                Supprimer 
                        <span className="badge ">{id+1}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center mb-3">
                <ReactPaginate
                    previousLabel={'<<'}
                    nextLabel={'>>'}
                    breakLabel={null}
                    breakClassName={null}
                    onPageChange={handlePageClick}
                    pageCount={pageCount} // This will be 12 if count is 111 and itemsPerPage is 10
                    marginPagesDisplayed={0}
                    pageRangeDisplayed={1}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    forcePage={validCurrentPage} // Ensure this doesn't exceed the max page
                    disableInitialCallback={true}
                />
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} bg="">
                <div className="flex gap-6 items-center">
                    <p className="">Vous êtes sûr de vouloir supprimer cette évaluation? </p>
                    <button className="btn btn-error btn-sm" onClick={confirmDelete}>Oui</button>
                </div>
            </Modal>
        </div>
    );
}
