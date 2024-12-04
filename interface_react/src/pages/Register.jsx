import { useEffect, useState, } from "react"
import Modal from "../component/Modal";
import User from "../component/User";
import { Navigate, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";


const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function Register() {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPw, setShowPw] = useState(false)
	const [role, setRole] = useState('')
	const [usernameUpdate, setUsernameUpdate] = useState('')
	const [emailUpdate, setEmailUpdate] = useState('')
	const [roleUpdate, setRoleUpdate] = useState('')
	const [idUpdate, setIdUpdate] = useState(0)
	const [users, setUsers] = useState([])
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenUpdate, setIsOpenUpdate] = useState(false)
	const [isDeleteModal, setIsDeleteModal] = useState(false)
	const [is401, setIs401] = useState(false)
	const [isLoading, setIsLoading] = useState(false);
	const [isMessage, setIsMessage] = useState(false)
	const navigate = useNavigate()
	const fetchUser = async () => {
		setIsLoading(true)
		const response = await fetch(`${ENDPOINT}/user`, {
			credentials: 'include'
		})

		if (response.status === 401) {
			setIs401(true)
			// navigate('/login')
		} else if (response.ok) {
			const data = await response.json()
			setUsers(data)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		fetchUser()
	}, [])

	const handleAddUser = async (e) => {
		e.preventDefault()
		try {
			const response = await fetch(`${ENDPOINT}/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, role }),
				credentials: 'include'
			})

			if (response.ok) {
				const data = await response.json();
				fetchUser()
				setIsOpen(false);
				setUsername('')
				setEmail('')
				setPassword('')
				setRole('')
				setIsMessage(false)

			} else {
				setIsMessage(true)

			}
		} catch (error) {
			console.error('Network error:', error);
		}
	}

	const openAddModal = () => {
		setIsOpen(true);
		setIsDeleteModal(false)
	};

	const handleDelete = (id) => {
		setIsDeleteModal(true)
		const [user] = users.filter(user => {
			return user.id === id
		})
		localStorage.setItem('user', user.email)
		localStorage.setItem('deletUserId', id)
	};

	const submitDelete = async () => {
		const id = localStorage.getItem('deletUserId')
		const response = await fetch(`${ENDPOINT}/user/delete/${id}`, {
			credentials: 'include'
		})

		if (response.ok) {
			const data = await response.json()
			fetchUser()
			setIsDeleteModal(false)
		}
	}

	const handleEdit = async (id) => {
		setIdUpdate(id)
		const response = await fetch(`${ENDPOINT}/user/${id}`, {
			credentials: 'include'
		})
		if (response.ok) {
			const data = await response.json()
			setEmailUpdate(data.email)
			setUsernameUpdate(data.username)
			setRoleUpdate(data.role)
			setIsMessage(false)
		}
		setIsOpenUpdate(true)
	}

	const closeModal = () => {
		setIsOpen(false);
		setIsOpenUpdate(false)
		setUsername('')
		setEmail('')
		setPassword('')
		setRole('')
	};

	const onCloseDeleteModal = () => {
		setIsDeleteModal(false)
	}

	const onClose401 = () => {
		setIs401(false)
		navigate('/login')
	}

	const handleUpdate = async (e) => {
		e.preventDefault()

		const response = await fetch(`${ENDPOINT}/user/update/${idUpdate}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ usernameUpdate, roleUpdate }),
			credentials: 'include'
		})
		if (response.ok) {
			const data = await response.json()
			setIsOpenUpdate(false)
			fetchUser()
		} else {
			setIsMessage(true)
		}
	}

	const toggleShow = () => {
		setShowPw(!showPw)
	}

	const userRole = localStorage.getItem('role')
	// si le role n'est pas administrateur revenir sur la page d'accueil
	// Redirection vers la page de login si l'utilisateur n'est pas authentifié
	if (userRole !== 'Administrateur') {
		return <Navigate to={'/login'} />;
	}
	return (
		<div className="xl:ml-64 max-xl:ml-24 ">
			<div className="flex-grow p-6 bg-gray-100">
				<h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
			</div>
			{isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
			<Modal isOpen={is401} onClose={onClose401} bg={''}>
				<p className="mb-3">Votre connection est expirimée. Recoonectez-vous à nouveau!</p>
			</Modal>

			<User users={users} openAddModal={openAddModal} handleDelete={handleDelete} handleEdit={handleEdit} />


			<Modal isOpen={isDeleteModal} onClose={onCloseDeleteModal} bg={''} margin='ml-64'>
				<p className="mb-3">Vous êtes sûr de vouloir supprimer l'utilisateur {localStorage.getItem('email')}?</p>
				<p className="mb-3 text-red-600 font-bold">Toutes les évaluations effectuées ou validées par cet utilisateur seront supprimées!</p>
				<div className="flex justify-start gap-3">
					<button onClick={submitDelete} className="btn btn-neutral btn-sm">Oui</button>
					<button onClick={onCloseDeleteModal} className="btn btn-neutral btn-sm">Non</button>
				</div>
			</Modal>



			<Modal isOpen={isOpen} onClose={closeModal} margin='ml-64'>
				<div className=' flex justify-center items-center  '>
					<div className='flex flex-col gap-5 justify-center items-center  w-full'>
						<h2 className='text-2xl font-bold'>Ajouter un utilisateur</h2>
						<form onSubmit={handleAddUser} className="flex flex-col gap-5 w-1/2 max-md:w-full">
							{/* <input
								className='input input-bordered input-primary w-full '
								type="text"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Nom d'utilisateur" /> */}
							<input
								className='input input-bordered input-primary w-full '
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="E-mail" />
							<div className="relative">
								<input
									className='input input-bordered input-primary w-full '
									type={showPw ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Mot de passe" />
									<FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />

							</div>
							<select className="select select-bordered select-primary w-full" defaultValue={'DEFAULT'}
								onChange={(e) => setRole(e.target.value)}>
								<option value="DEFAULT" disabled>Choisir un rôle</option>
								<option value="Administrateur">Administrateur</option>
								{/* <option value="Validateur">Validateur</option> */}
								<option value="Annotateur">Annotateur</option>
							</select>
							<button className='btn btn-primary'>Valider</button>
							{isMessage && <p className="text-red-500">Cette adresse mail existe déjà!</p>}
						</form>
					</div>
				</div>
			</Modal>

			<Modal isOpen={isOpenUpdate} onClose={closeModal} margin='ml-64'>
				<div className=' flex justify-center items-center  '>
					<div className='flex flex-col gap-5 justify-center items-center  w-full'>
						<h2 className='text-2xl font-bold'>Modifier le profile</h2>
						<form onSubmit={handleUpdate} className="flex flex-col gap-5 w-1/2 max-md:w-full">
							<input
								className='input input-bordered input-primary w-full '
								type="text"
								required
								value={usernameUpdate}
								onChange={(e) => setUsernameUpdate(e.target.value)}
								placeholder="Nom d'utilisateur" />
							<input
								className='input input-bordered input-primary w-full '
								type="email"
								required
								value={emailUpdate}
								onChange={(e) => setEmailUpdate(e.target.value)}
								readOnly
								placeholder="E-mail" />

							<select className="select select-bordered select-primary w-full" defaultValue={roleUpdate}
								onChange={(e) => setRoleUpdate(e.target.value)}>
								<option value="DEFAULT" disabled>Choisir un rôle</option>
								<option value="Administrateur">Administrateur</option>
								{/* <option value="Validateur">Validateur</option> */}
								<option value="Annotateur">Annotateur</option>
							</select>
							<button className='btn btn-primary'>Valider</button>
							{isMessage && <p className="text-red-500">Cette adresse mail existe déjà!</p>}
						</form>
					</div>
				</div>
			</Modal>
		</div>
	)
}


