import { useState, useContext } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { UserContext } from "../component/UserContext";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";



    // const ENDPOINT = 'http://134.157.57.237:3500' 
    // const ENDPOINT = 'http://localhost:3500' 

	const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
	// const ENDPOINT = 'http://localhost:8000/api'
export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPw, setShowPw] = useState(false)
	const [logged, setLogged] = useState(false)
	const [message, setMessage] = useState('')
	const {setUser} = useContext(UserContext)
	const [isError,setisError] = useState(false)
	const handleLogin = async (e) => {
		e.preventDefault()

		try {
			const response = await fetch(`${ENDPOINT}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
				credentials:'include'

			})
			
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('id', data.id)
				localStorage.setItem('token', data.token)
				localStorage.setItem('role', data.role)
				localStorage.setItem('username', data.username)
				localStorage.setItem('email', data.email)

				// onLogin(token)
				setLogged(true)
				setUser(data)
			} else {
				const data = await response.json()
				setisError(true)
				setMessage(data.error)
				
			}
		} catch (error) {
			console.error('Network error:', error);
		}
	}

	const toggleShow = () => {
		setShowPw(!showPw)
	}

	if (logged) {
		if (localStorage.getItem('role') === 'Administrateur'){
			return <Navigate to={'/admin/dashboard'} />
		// } else if (localStorage.getItem('role') === 'Validateur') {
		// 	return <Navigate to={'/validation'} />
		} else {
			return <Navigate to={'/'} />
		}
	}
	return (
		<div className='h-screen flex justify-center items-center'>
			<div className='flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2 shadow-2xl'>
				<h2 className='text-2xl font-bold'>LOGIN</h2>
				<form onSubmit={handleLogin} className="flex flex-col gap-5 w-[400px] px-3">
					<input
						className='input input-bordered input-primary w-full'
						type="text"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="E-mail" />
						<div className='relative'>

					<input
						className='input input-bordered input-primary w-full'
						type={showPw?"text":"password"}
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Mot de passe" />
						{showPw && <FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />}
						{!showPw &&<FaRegEyeSlash className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />}
						</div>
					<button className='btn btn-primary'>Login</button>
					{/* <NavLink to={'/forgot-password'} className="ml-auto underline text-blue-500">mot de passe oublié</NavLink> */}
					{isError && <p className='text-red-400'>{message}</p>}
				</form>
				{/* {isflash && <Flash color="red" message={message} onClose={onClose} />} */}
			</div>
		</div>
	)
}