export default function Flash({message,color, onClose, onValidate}) {
    return (
      <div className={`bg-${color}-500 p-3 shadow-2xl w-2/3 rounded mt-5 m-auto`}>
          <div className="flex flex-col gap-3 justify-between items-center ">
              <p className="">{message}</p>
              <div className="flex justify-around w-full">
                <button onClick={onClose} className="btn btn-primary">Annuler</button>
                <button onClick={onValidate} className="btn btn-error text-white">Supprimer</button>
              </div>
          </div>
      </div>
    )
  }