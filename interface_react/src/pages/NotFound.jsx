import { Link } from 'react-router-dom';

export default function NotFound() {
    const role = localStorage.getItem('role')
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl mt-4">Oops! Cette page n'existe pas.</p>
            {role === 'Administrateur' && <Link to="/admin/dashboard" className="mt-6 text-blue-500 underline">Retourner à la page d'accueil</Link>}
            {role === 'Annotateur' && <Link to="/" className="mt-6 text-blue-500 underline">Retourner à la page d'accueil</Link>}
            {role === 'Validateur' && <Link to="/validation" className="mt-6 text-blue-500 underline">Retourner à la page d'accueil</Link>}
        </div>
    );
}
