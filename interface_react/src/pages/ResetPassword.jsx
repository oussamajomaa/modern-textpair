import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate(); // Hook pour rediriger

    // Récupérer le token depuis l'URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage('Token manquant');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/password-reset/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message || data.error);
            // Rediriger vers la page de connexion après la réinitialisation
            navigate('/login');
        } else {
            setMessage('Erreur lors de la réinitialisation du mot de passe.');
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2 shadow-2xl'>
                <h2 className='text-2xl font-bold'>Réinitialiser le mot de passe</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-[400px] px-3">
                    <input
                        className='input input-bordered input-primary w-full'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Nouveau mot de passe :'
                    />
                    <button type="submit" className='btn btn-primary'>Réinitialiser</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}
