import { useState } from 'react';
const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${ENDPOINT}/reset-password-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            setMessage('Un email a été envoyé pour réinitialiser votre mot de passe.');
        } catch (error) {
            setMessage('Erreur : email non trouvé.');
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2 shadow-2xl'>
                <h2 className='text-2xl font-bold'>Mot de passe oublié</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-[400px] px-3">
                    <input
                        className='input input-bordered input-primary w-full'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre adresse email"
                        required
                    />
                    <button type="submit" className='btn btn-primary'>Envoyer</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default ForgotPassword;

