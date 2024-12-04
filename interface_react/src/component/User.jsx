
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

export default function User({ users, openAddModal, handleDelete, handleEdit }) {
    const email = localStorage.getItem('email')
    return (
        <div className="p-5 shadoww xl:w-2/3 m-auto max-xl:w-full ">
            <h1 className="text-center font-bold text-2xl mb-3">Liste des utilisateurs</h1>
            <button onClick={openAddModal} className="block ml-auto mb-2"><IoIosAddCircle size={40} color="#5C7BD9" /></button>
            <div className="bg-slate-300 p-5  rounded-lg h-[calc(100vh-300px)] overflow-y-auto shadow-xl shadow-slate-500/50">
                <div className="flex gap-2 w-full mb-2 pb-2 border-b-2">
                    {/* <span className="w-5/12 font-bold">Username</span> */}
                    <span className="w-5/12 font-bold">E-mail</span>
                    <span className="w-5/12 font-bold">Role</span>
                    <span className="w-2/12 font-bold text-center">Actions</span>
                </div>

                {users?.filter(user => email !== user.email).map(user => (
                    <div className="flex gap-2 w-full p-4 hover:bg-slate-400 bg-white mb-2 rounded-lg" key={user.id}>
                        {/* <p className="w-5/12">{user.username}</p> */}
                        <p className="w-5/12">{user.email}</p>
                        <p className="w-5/12">{user.role}</p>

                        <div className="w-2/12 flex justify-center">
                        {/* <button onClick={()=> handleEdit(user.id)}>
                            <FaRegEdit size={32} color="green" />
                        </button> */}
                            <button onClick={() => handleDelete(user.id)}>
                                <MdDelete size={32} color="#DC2626" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
