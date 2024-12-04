import { IoIosCloseCircle } from "react-icons/io";

export default function Modal({ isOpen, onClose, children, bg,margin}) {


	if (!isOpen) return null;

	return (
		<div className={`fixed inset-0 flex items-center justify-center z-50 ${margin}`}>
			<div className="fixed inset-0 bg-black opacity-50 "></div>
			<div className="relative bg-white rounded-lg w-1/2 ">
				<div className="absolute top-0 right-0 p-2 ">
					<button className="btn btn-circle btn-sm btn-ghost btn-neutral " onClick={onClose}>
						<IoIosCloseCircle size={24} color="black" />
					</button>
				</div>
				<div className={`p-6 rounded   ${bg} `}>
					{children}
				</div>
			</div>
		</div>

	);
}
