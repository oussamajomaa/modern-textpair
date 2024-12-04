import React, { useState } from "react";

const Accordion = ({ data, onKeyClick }) => {
	const [openKey, setOpenKey] = useState(null); // Gère quelle clé est ouverte

	// Séparer les clés 'source_' et 'target_'
	const sourceKeys = Object.keys(data).filter((key) => key.startsWith("source"));
	const targetKeys = Object.keys(data).filter((key) => key.startsWith("cible"));

	// Fonction pour basculer l'état d'une clé (ouvrir/fermer)
	const toggleKey = (key) => {
		setOpenKey(openKey === key ? null : key); // Ferme la clé si elle est déjà ouverte, sinon ouvre-la
	};

	return (
		<div>

			<div>
				<h2 className="text-center text-xl font-semibold border py-1 bg-slate-100 rounded-md">Source</h2>
				{sourceKeys.map((key) => (
					<div key={key} className="my-5">
						<div
							className="flex justify-between text-xl cursor-pointer mb-2"
							onClick={() => toggleKey(key)}
						>
							{/* {key} {openKey === key ? "-" : "+"} */}
							<span className="w-2/3">{key}</span>
							<span className="badge badge-warning text-xl">{openKey === key ? "-" : "+"}</span>
						</div>
						{openKey === key && (
							<div className="ml-3 text-gray-500">

								{/* Affichage du contenu de la clé sélectionnée */}
								{data[key]
									.sort((a, b) => b.count - a.count) // Trier par count (du plus grand au plus petit)
									.map((item, index) => (
										// <a onClick={() => onKeyClick(key, item.value)} key={index}>
										<div key={index} className="flex justify-between hover:bg-slate-50 border-b-2 py-1">
											<span className="w-2/3">{item.value}</span>
											<span>{item.count}</span>
										</div>
										// </a>
									))
								}
							</div>
						)}
					</div>
				))}
			</div>

			<div>
				<h2 className="text-center text-xl font-semibold border py-1 bg-slate-100 rounded-md">Target</h2>
				{targetKeys.map((key) => (
					<div key={key} className="my-5">
						<div
							className="flex justify-between text-xl cursor-pointer mb-2"
							onClick={() => toggleKey(key)}
						>
							{/* {key} {openKey === key ? "-" : "+"} */}
							<span className="w-2/3">{key}</span>
							<span className="badge badge-warning text-xl">{openKey === key ? "-" : "+"}</span>
						</div>
						{openKey === key && (
							<div className="ml-3 text-gray-500">
								{/* Affichage du contenu de la clé sélectionnée */}
								{data[key]
									.sort((a, b) => b.count - a.count) // Trier par count (du plus grand au plus petit)
									.map((item, index) => (
										<div key={index} className="flex justify-between hover:bg-slate-50 border-b-2 py-1">
											<span className="w-2/3">{item.value}</span>
											<span>{item.count}</span>
										</div>
									))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Accordion;