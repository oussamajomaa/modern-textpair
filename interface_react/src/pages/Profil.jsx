import { useState } from "react";
import Modal from "../component/Modal";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function Profil() {
    const [isOpen, setIsOpen] = useState(false)
    const [oldPW, setOldPW] = useState('')
    const [newPW, setNewPW] = useState('')
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isChanged, setIsChanged] = useState(false)
    const [message,setMessage] = useState('')
    const role = localStorage.getItem('role')

    const toggleOldPW = () => {
        setShowOld(!showOld);
    };

    const toggleNewPW = () => {
        setShowNew(!showNew);
    };

    const changePW = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setIsChanged(false)
    }

    const handlSubmit = async (e) => {
        e.preventDefault()
        const userId = parseInt(localStorage.getItem('id'))
        const response = await fetch(`${ENDPOINT}/user/change_pw/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                oldPW: oldPW,
                newPW: newPW,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setMessage('Mot de passe changé avec succés');
        } else {
            const errorData = await response.json();
            setMessage('Mot de passe incorrectd');
        }
        setIsOpen(false)
        setShowOld(false)
        setShowNew(false)
        setOldPW('')
        setNewPW('')
        setIsChanged(true)
    }

    return (
        <div className="">
            {role === 'Administrateur' && <div className="flex-grow p-6 bg-gray-100 xl:ml-64 max-xl:ml-24">
                <h1 className="text-3xl font-bold">Profile</h1>
            </div>}
            <div className="p-5">
                <h1 className={`text-3xl font-bold text-center mb-6 ${role==='Administrateur'?'xl:ml-64 max-xl:ml-24':''}`}>Profile Utilisateur</h1>
                <Modal isOpen={isChanged} onClose={closeModal} bg="bg-yellow-300" margin={`${role==='Administrateur'?'ml-64':''}`}>
                    <h2 className="text-center">{message}</h2>
                </Modal>
                <Modal isOpen={isOpen} onClose={closeModal} margin={`${role==='Administrateur'?'xl:ml-64 max-xl:ml-24':''}`}>

                    <form className="p-5 flex flex-col gap-5" onSubmit={handlSubmit}>
                            {/* <input
                                className='input input-bordered input-primary w-full '
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ancien mot de passe!" /> */}
                        <div className="relative">
                            <input
                                className='input input-bordered input-primary w-full '
                                type={showOld ? "text" : "password"}
                                required
                                value={oldPW}
                                onChange={(e) => setOldPW(e.target.value)}
                                placeholder="Ancien mot de passe!" />
                            <FaRegEye className="absolute top-4 right-5" onClick={toggleOldPW} />
                        </div>
                        <div className="relative">
                            <input
                                className='input input-bordered input-primary w-full '
                                type={showNew ? "text" : "password"}
                                required
                                value={newPW}
                                onChange={(e) => setNewPW(e.target.value)}
                                placeholder="Nouveau mot de passe" />
                            <FaRegEye className="absolute top-4 right-5" onClick={toggleNewPW} />
                        </div>
                        <button className="btn">Valider</button>
                    </form>
                </Modal>
                <div className={`${role === "Administrateur" ? "xl:ml-64 max-xl:ml-24" : ""}  `}>
                    <div className={`xl:w-[600px] max-xl:w-full m-auto bg-slate-300 p-5 flex flex-col gap-5 rounded-md `}>
                        {/* <div className="flex gap-3">
                            <h2 className="w-1/2 text-right text-2xl font-bold">Nom d'utilisateur :</h2>
                            <h2 className="w-1/2 text-2xl">{username}</h2>
                        </div> */}
                        <div className="flex gap-3">
                            <h2 className="w-1/2 text-right text-2xl font-bold">Adresse mail :</h2>
                            <h2 className="w-1/2 text-2xl">{localStorage.getItem('email')}</h2>
                        </div>
                        <div className="flex gap-3">
                            <h2 className="w-1/2 text-right text-2xl font-bold">Rôle :</h2>
                            <h2 className="w-1/2 text-2xl">{role}</h2>
                        </div>
                        <button className="text-blue-600 btn" onClick={changePW}>Changer mon mot de passe!</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
