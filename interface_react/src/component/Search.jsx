import { useRef } from "react";

export default function Search() {
	const form = useRef();
	const button = useRef();

	const handlSubmit = (e) => {
		e.preventDefault()
		console.log(form);
		console.log(button);
		form.current.style.display = 'none'
		button.current.style.display = 'block'
	}

	const showForm = () => {
		form.current.style.display = 'block'
		button.current.style.display = 'none'
	}
	return (
		<div className=" shadow-md m-5 p-5 ">
			<button onClick={showForm} className=" hidden show-form btn btn-outline w-full" ref={(el) => button.current =el}>Show search form</button>
			<form onSubmit={handlSubmit} ref={(el) => form.current = el} >
				<div className=" flex">
					<div className="p-5 source w-1/2 border-r">
					<h3 className=" font-bold mb-2">Source</h3>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Passage
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Author
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Title
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Date
							<input type="text" className="grow" />
						</label>
					</div>
					<div className="p-5 target w-1/2 border-l">
						<h3 className=" font-bold mb-2">Target</h3>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Passage
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Author
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Title
							<input type="text" className="grow" />
						</label>
						<label className="input input-bordered flex items-center gap-2 mb-1">
							Date
							<input type="text" className="grow" />
						</label>
					</div>
				</div>

				<button className="btn bg-sky-600 hover:bg-sky-700 text-white btn-sm px-6 mr-2">Search</button>
				<button type="reset" className="btn btn-sm px-6 bg-red-400 hover:bg-red-500 text-white ">Reset</button>
			</form>
		</div>
	)
}
