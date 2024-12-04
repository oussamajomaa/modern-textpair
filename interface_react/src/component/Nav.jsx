
import { Navigate, NavLink,useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { MdDashboard } from "react-icons/md";
import { MdCompare } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { AiOutlineLogout } from "react-icons/ai";


const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function Nav() {
	const token = localStorage.getItem('token');
	const role = localStorage.getItem('role');
	const email = localStorage.getItem('email');
	const [isOpen, setIsOpen] = useState(false);
	const [width, setWidth] = useState(window.innerWidth);
	const { user, setUser } = useContext(UserContext);
	
	const location = useLocation()
	// Fermer le menu automatiquement en cas de petit écran
	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		if (width < 1024) {
			setIsOpen(false);
		}
		return () => window.removeEventListener('resize', handleResize);
	}, [width]);

	const logout = () => {
		fetch(`${ENDPOINT}/logout`, {
			credentials: 'include',
			method: 'POST'
		});
		setUser(null);
		localStorage.clear();
		setIsOpen(false);
	};

	// Menu latéral pour l'administrateur
	const AdminSidebar = () => (
		<div className="flex">
			{/* Sidebar */}
			<div className="h-screen  bg-gray-800 text-white flex flex-col p-4 fixed w-64 max-xl:hidden">
				<div className="mb-4 flex items-center flex-col gap-5">
					<a><img src="/modern-textpair/logo.svg" className="w-100 h-10 mr-2" alt="Logo" /></a>
					<p>Bonjour</p> <span className="font-bold">{email}</span>
				</div>

				<nav className="flex flex-col flex-grow ">
					<NavLink to="/admin/dashboard" className="py-3 mt-5 hover:bg-gray-700  ">Dashboard</NavLink>
					<NavLink to="/admin/alignement" className="py-3  hover:bg-gray-700  ">Alignements</NavLink>

					<NavLink to="/admin/register" className="py-3  hover:bg-gray-700  ">Utilisateurs</NavLink>
					<NavLink to="/admin/rapport" className="py-3  hover:bg-gray-700  ">Rapports</NavLink>
					<NavLink to="/profil" className="py-3  hover:bg-gray-700  ">Profile</NavLink>
					<NavLink
						className="py-3 bg-red-600 mt-auto text-center rounded"
						onClick={logout} to={'/login'} >Déconnexion
					</NavLink>
				</nav>
			</div>

			<div className="h-screen  bg-gray-800 text-white flex flex-col p-4 fixed w-24 xl:hidden">
				{/* <div className="mb-4 flex items-center flex-col gap-5">
					<a><img src="/modern-textpair/logo.svg" className="w-100 h-10 mr-2" alt="Logo" /></a>
					<p>Bonjour <span className="font-bold">{email}</span></p>
				</div> */}

				<nav className="flex flex-col flex-grow items-center">
					<NavLink title="Tableau de board" to="/admin/dashboard" className="py-3 mt-5 hover:bg-gray-700  "><MdDashboard  size={36}/></NavLink>
					<NavLink title="Alignements" to="/admin/alignement" className="py-3  hover:bg-gray-700  "><MdCompare size={36} /></NavLink>

					<NavLink title="Utilisateurs" to="/admin/register" className="py-3  hover:bg-gray-700  "><FaUserFriends size={36} /></NavLink>
					<NavLink title="Rapports" to="/admin/rapport" className="py-3  hover:bg-gray-700  "><FaFileCsv size={36}/></NavLink>
					<NavLink title="Profile" to="/profil" className="py-3  hover:bg-gray-700  "><ImProfile size={36}/></NavLink>
					<NavLink title="Déconnexion"
						className="  mt-auto text-center rounded btn  bg-[red]"
						onClick={logout} to={'/login'} ><AiOutlineLogout size={36} color="white"/>
					</NavLink>
				</nav>
			</div>

		</div>
	);

	// Menu principal pour autres rôles
	const UserNavbar = () => (
		<nav className="flex items-center justify-between flex-wrap p-3 bg-slate-600 sticky top-0 backdrop-blur-3xl z-10">
			<div className="flex items-center flex-shrink-0 mr-6 gap-6">
				<a href="/modern-textpair"><img src="/modern-textpair/logo.svg" className="w-100 h-10 mr-2" alt="Logo" /></a>
				<p className="block mt-4 lg:inline-block lg:mt-0 mr-4 text-white">Bonjour <span className="font-bold">{email}</span></p>
			</div>
			<div className="block lg:hidden">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400">
					<svg
						className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" fill="white" />
					</svg>
					<svg
						className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" fill="white" />
					</svg>
				</button>
			</div>
			<div className={`w-full block lg:flex lg:items-center lg:w-auto text-white ${isOpen ? "block" : "hidden"}`}>
				{role === 'Annotateur' && <NavLink
					onClick={() => setIsOpen(!isOpen)} to={'/'}
					className='block mt-4 lg:inline-block lg:mt-0  mr-4'>Accueil
				</NavLink>}
				{/* {role === 'Validateur' &&
					<NavLink
						onClick={() => setIsOpen(!isOpen)} to={'/validation'}
						className="block mt-4 lg:inline-block lg:mt-0 mr-4">Validation
					</NavLink>} */}
				{role === 'Annotateur' &&
					<NavLink
						onClick={() => setIsOpen(!isOpen)}
						className="block mt-4 lg:inline-block lg:mt-0 mr-4" to={'/update'}>Supprimer une évaluation
					</NavLink>}
				<NavLink
					className="block mt-4 lg:inline-block lg:mt-0 mr-4"
					to={'/profil'} >Profile
				</NavLink>
				<NavLink
					className="block mt-4 lg:inline-block lg:mt-0 mr-4"
					onClick={logout} to={'/login'} >Déconnexion
				</NavLink>
			</div>
		</nav>
	);
	// Liste des routes exclues de la vérification du cookie
	const excludedRoutes = ['/forgot-password','/reset-password'];

	// Ne pas vérifier le cookie pour certaines routes
	if (!document.cookie && !excludedRoutes.includes(location.pathname)) {
	  localStorage.clear();
	  return <Navigate to={'/login'} />;
	}

	return (
		<>
			{/* Si l'utilisateur est connecté (token existant), on affiche le menu */}
			{token && role === 'Administrateur' ? <AdminSidebar /> : null}
			{token && role !== 'Administrateur' ? <UserNavbar /> : null}
		</>
	);
}
