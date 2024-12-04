
// export default function UserForm({ email,password,role, setEmail, setPassword, setRole, handleSubmit, title}) {
//     // const [email, setEmail] = useState('')
//     // const [password, setPassword] = useState('')
//     // const [role, setRole] = useState('')
//     return (

//         <div className=' flex justify-center items-center'>
//             <div className='flex flex-col gap-5 justify-center items-center  '>
//                 <h2 className='text-2xl font-bold'>{title}</h2>
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//                     <input
//                         className='input input-bordered input-primary w-full max-w-xs'
//                         type="text"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="E-mail" />
//                     <input
//                         className='input input-bordered input-primary w-full max-w-xs'
//                         type="password"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Mot de passe" />
//                     <select className="select select-bordered select-primary w-full max-w-xs" value={role}
//                         onChange={(e) => setRole(e.target.value)}>
//                         <option value="DEFAULT" disabled>Choisir un rôle</option>
//                         <option value="Administrateur">Administrateur</option>
//                         <option value="Validateur">Validateur</option>
//                         <option value="Annotateur">Annotateur</option>
//                     </select>
//                     <button className='btn btn-primary'>Valider</button>
//                 </form>
//             </div>
//         </div>
//         )
// }
