import { useEffect, useState } from "react";
import Alignement from "../component/Alignement";
import { Navigate } from "react-router-dom";
import ReactPaginate from "react-paginate";


const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
export default function Validation() {
	const [paragraphs, setParagraphs] = useState([])
	const [isSpinnser, setIsSpinner] = useState(false)
	const [count, setCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastId, setLastId] = useState(null); // Start with null for better control
	const [currentPage, setCurrentPage] = useState(0); // Page actuelle
	const itemsPerPage = 50; // Nombre d'éléments par page
	const [pageIds, setPageIds] = useState([0]); // Initial pageIds starts with 0 for first page
	const userId = localStorage.getItem('id')
	const fetchResults = async (lastId = 0) => {
		setIsSpinner(true)
		const response = await fetch(`${ENDPOINT}/validation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ lastId, userId }), // Passer le dernier ID pour récupérer les éléments suivants
			credentials: 'include',
		})
		if (response.ok) {
			const data = await response.json()
			setParagraphs(data.results)
			setCount(data.count)
			setLastId(data.lastId)
			setIsSpinner(false)
		}
	}

	// Fonction pour gérer le clic sur les numéros de page
	const handlePageClick = async (event) => {
		setIsSpinner(true)
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
		// Mettre le curseur en haut de la page après le changement
		window.scrollTo(0, 0);
		setCurrentPage(selectedPage); // Mettre à jour la page courante
		setIsSpinner(false)
	};

	useEffect(() => {
		fetchResults()
	}, [])

	const role = localStorage.getItem('role')
	// si le role n'est pas validateur revenir sur la page d'accueil
	if (role !== 'Validateur') {
		return <Navigate to={'/login'} />
	}

	const pageCount = Math.ceil(count / itemsPerPage); // In your case, this will be 12
	const validCurrentPage = currentPage >= pageCount ? pageCount - 1 : currentPage; // Ensure valid current page
	return (
		<div>
			{/* {isSpinnser && <span className="loading loading-spinner text-primary"></span>} */}
			<div className=" shadow-md m-5 p-5 ">
			{isSpinnser && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
				<h2 className="py-2 px-3 mb-3 bg-black text-white text-center rounded">
					{count} Alignements à valider
				</h2>
				{paragraphs && paragraphs.map((text, counter) =>
					<Alignement text={text} counter={counter + currentPage * 50 + 1} key={text.id} />
				)}
			</div>
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
		</div>
	)
}
