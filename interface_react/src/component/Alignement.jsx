import { useRef, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import TargetAuthor from "./TargetAuthor";
import SourceAuthor from "./SourceAuthor";
import Modal from "./Modal"


// const ENDPOINT = 'http://134.157.57.237:3500' 
// const ENDPOINT = 'http://localhost:3500'
const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
export default function Alignement({ text, counter }) {
    const source_target = useRef([]);
    const source_target_before = useRef([]);
    const source_target_after = useRef([]);
    const source_before = useRef([]);
    const source_after = useRef([]);
    const target_before = useRef([]);
    const target_after = useRef([]);
    const source_alignement = useRef([]);
    const target_alignement = useRef([]);
    const show_btn = useRef([]);
    const hide_btn = useRef([]);
    const textarea_comment = useRef([]);
    const [comment, setComment] = useState(text.comment || ''); // Définir le commentaire existant ou une chaîne vide
    const btn_textarea = useRef([]);
    const save_comment = useRef([]);
    const add_comment = useRef([]);
    const check = useRef([]);
    const [isError, setIsError] = useState(false)

    const role = localStorage.getItem('role')
    const showDiff = (id) => {
        // Si le conteneur du texte traité existe
        if (source_target.current[id]) {
            if (source_target.current[id].querySelector('.css-cncyp1-word-diff')) {
                const spans = source_target.current[id].querySelectorAll('span.css-cncyp1-word-diff');

                // Parcourt tous les éléments 'span dont la classe est css-cncyp1-word-diff et supprimer la classe'
                // supprimer l'espace ajouter par la class css-cncyp1-word-diff.
                spans.forEach(span => {
                    // Vérifie si l'élément 'span' actuel contient un élément avec la classe '.css-hf3w1f-word-removed'
                    span.classList.add('diff')
                    span.classList.remove('css-cncyp1-word-diff')
                });
            }

            // Afficher la différence entre les deux textes
            source_target_after.current[id].style.display = 'flex'

            if (source_target.current[id].querySelector('.css-cncyp1-word-diff') === null) {
                source_alignement.current[id].innerHTML = ""
                target_alignement.current[id].innerHTML = ""
                source_alignement.current[id].innerHTML = source_before.current[id].innerHTML
                target_alignement.current[id].innerHTML = target_before.current[id].innerHTML
                let span_source = document.createElement('span')
                span_source.setAttribute('class', 'span-source text-[green]')
                let span_target = document.createElement('span')
                span_target.setAttribute('class', 'span-target text-[green]')
                source_alignement.current[id].appendChild(span_source)
                target_alignement.current[id].appendChild(span_target)
                source_alignement.current[id].querySelector('.span-source').textContent = source_target.current[id].querySelector('span.alignement').textContent
                target_alignement.current[id].querySelector('.span-target').textContent = source_target.current[id].querySelector('span.alignement').textContent
                source_alignement.current[id].innerHTML += source_after.current[id].innerHTML
                target_alignement.current[id].innerHTML += target_after.current[id].innerHTML

            }


            // récupérer le code html du texte source traité
            if (source_target.current[id].querySelector('.css-rq9a2a-diff-removed .css-o1u8iu-content-text')) {

                let source = source_target.current[id].querySelector('.css-rq9a2a-diff-removed .css-o1u8iu-content-text').innerHTML
                // Insérer le code html du texte source traité dans un paragraphe
                source_alignement.current[id].innerHTML = source_before.current[id].innerHTML + source + source_after.current[id].innerHTML
                // donner une color vert au passage après traitement
                let sources = source_alignement.current[id].querySelectorAll('.css-cncyp1-word-diff')
                sources.forEach(source => {
                    source.style.color = "green"
                })
                // donner une color rouge au passage source après traitement
                let removed = source_alignement.current[id].querySelectorAll('.css-hf3w1f-word-removed')
                removed.forEach(item => {
                    item.style.color = 'red'
                })

            }


            if (source_target.current[id].querySelector('.css-cnnxkz-diff-added .css-o1u8iu-content-text')) {

                // récupérer le code html du texte target traité
                let target = source_target.current[id].querySelector('.css-cnnxkz-diff-added .css-o1u8iu-content-text').innerHTML

                // Insérer le code html du texte target traité dans un paragraphe
                target_alignement.current[id].innerHTML = target_before.current[id].innerHTML + target + target_after.current[id].innerHTML
                // donner une color vert au passage après traitement
                let targets = target_alignement.current[id].querySelectorAll('.css-cncyp1-word-diff')
                targets.forEach(target => {
                    target.style.color = "green"
                })
                // donner une color blue au passage target après traitement
                let targets1 = target_alignement.current[id].querySelectorAll('.css-1u4zuq6-word-added')
                targets1.forEach(target => {
                    target.style.color = "blue"
                })
            }



            // cacher le bouton afficher
            show_btn.current[id].style.display = 'none'
            // afficher le bouton cacher
            hide_btn.current[id].style.display = 'block'

            // cacher le texte original
            source_target_before.current[id].style.display = 'none'

            // setShow(!show)
        }
    }

    const hideDiff = (id) => {
        // Si le conteneur du texte traité existe
        if (source_target.current[id]) {

            // cacher le texte traité
            source_target_after.current[id].style.display = 'none'

            // afficher le bouton afficher
            show_btn.current[id].style.display = 'block'

            // cacher le bouton cacher
            hide_btn.current[id].style.display = 'none'

            // Afficher le texte original
            source_target_before.current[id].style.display = 'flex'
            // setShow(!show)
        }
    }

    // Fonction pour gérer les changements de valeur dans le textarea
    const handleCommentChange = (e) => {
        setComment(e.target.value); // Met à jour l'état avec la nouvelle valeur du textarea
    };

    // Lorsqu'on clique sur le button ajouter un commentaire
    const addComment = (id) => {
        if (textarea_comment.current[id]) {
            // cacher le bouton ajouter commentaire
            add_comment.current[id].style.display = 'none'
            // afficher le bouton enregistrer commentaire
            save_comment.current[id].style.display = 'block'
            // afficher le textarea et le button de close
            textarea_comment.current[id].style.display = 'block'
            btn_textarea.current[id].style.display = 'block'
        }
    }

    // Lorsqu'on clique sur le button close textarea
    const closeTextArea = (id) => {
        if (textarea_comment.current[id]) {
            // vider et chacher le textarea et le button de close
            // textarea_comment.current[id].value = ''
            textarea_comment.current[id].style.display = 'none'
            btn_textarea.current[id].style.display = 'none'
            // afficher le button ajouter un commentaire et cacher le button enregistrer
            add_comment.current[id].style.display = 'block'
            save_comment.current[id].style.display = 'none'
        }
    }

    // Lorsqu'on clique sur le button enregistrer pour enregistrer le commentaire dans la BDD
    const saveComment = async (id, alignment_id) => {
        if (textarea_comment.current[id]) {
            const comment = textarea_comment.current[id].value;
            if (comment) {
                const user_id = localStorage.getItem('id');

                try {
                    const response = await fetch(`${ENDPOINT}/comment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ user_id, alignment_id, comment }),
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                    } else if (response.status === 400) {
                        setIsError(true)
                        // Handle error when evaluation doesn't exist
                        const errorData = await response.json();
                        // alert(errorData.message); // Show a user-friendly message
                    } else {
                        console.error('Error:', response.status);
                        setIsError(true)
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error);
                    alert("There was an issue processing your request. Please try again later.");
                }
            }

            // Reset UI after saving
            save_comment.current[id].style.display = 'none';
            textarea_comment.current[id].style.display = 'none';
            btn_textarea.current[id].style.display = 'none';
            add_comment.current[id].style.display = 'block';
        }
    }

    const closeModal = () => {
		setIsError(false)
	}
    // lorsqu'on clique sur la rdiobutton, on envoie une requette directement à la base de donnée
    // pour sauvegarder la valeur de la radiobutton
    const handleRadio = async (e, alignement_id) => {
        const evaluate = e.target.value
        const user_id = localStorage.getItem('id')

        try {
            const response = await fetch(`${ENDPOINT}/evaluate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, alignement_id, evaluate }),
                credentials: 'include'

            })

            if (response.ok) {
                const data = await response.json();
            }
        } catch (error) {
            console.error('Network error:', error);
        }

    }

   

    const handleValidate = async (e, textId) => {
        const validate = e.target.checked

        const validateur_id = localStorage.getItem('id')
        const response = await fetch(`${ENDPOINT}/validation/${textId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ validateur_id, validate }),
            credentials: "include"
        })

        if (response.ok) {
            const data = await response.json()
        }
    }
    return (
        <div className="relative">
            <div className="div-table m-5 my-6 p-1 border shadow-xl relative rounded" ref={(el) => source_target.current[counter] = el}>
                <span className="absolute top-0 left-0 bg-slate-600 p-4 rounde text-white text-xs">{counter}</span>
                <div className="view-all flex max-lg:flex-col" ref={(el) => source_target_before.current[counter] = el}>
                    <div className="div-par-left w-1/2 max-lg:w-full p-4 border-r border-black max-lg:border-r-0 max-lg:border-b">
                        <h3 className="text-xl font-bold mb-2 text-center">Source</h3>
                        <SourceAuthor text={text} />
                        <p>
                            <span ref={(el) => source_before.current[counter] = el}>{text.source_before}</span>
                            <span className="align alignement">{text.source_content}</span>
                            <span ref={(el) => source_after.current[counter] = el}>{text.source_after}</span>
                        </p>
                    </div>

                    <div className="div-par-right w-1/2 max-lg:w-full p-4">
                        <h3 className="text-xl font-bold mb-2 text-center">Cible</h3>
                        <TargetAuthor text={text} />
                        <p>
                            <span ref={(el) => target_before.current[counter] = el}>{text.target_before}</span>
                            <span className="align alignement">{text.target_content}</span>
                            <span ref={(el) => target_after.current[counter] = el}>{text.target_after}</span>
                        </p>
                    </div>

                </div>

                <div className="view-diff max-lg:flex-col" ref={(el) => source_target_after.current[counter] = el}>
                    <div className="div-par-left w-1/2 max-lg:w-full p-4 border-r border-black max-lg:border-r-0 max-lg:border-b">
                        <h3 className="text-xl font-bold mb-2 text-center">Source</h3>
                        <SourceAuthor text={text} />
                        <p ref={(el) => source_alignement.current[counter] = el}></p>
                    </div>
                    <div className="div-par-right w-1/2 max-lg:w-full p-4">
                        <h3 className="text-xl font-bold mb-2 text-center">Cible</h3>
                        <TargetAuthor text={text} />
                        <p ref={(el) => target_alignement.current[counter] = el}></p>
                    </div>
                </div>

                {/* textarea pour ajouter un commentaire. Il est caché par defaut */}
                <div className='flex justify-center relative' >
                    <textarea placeholder='Ajouter un commentaire...'
                        className="hidden textarea textarea-bordered w-full m-4 border-gray border"
                        ref={(el) => { textarea_comment.current[counter] = el }}
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <button className="hidden btn btn-circle btn-xs btn-outline absolute top-5 right-5" onClick={() => closeTextArea(counter)} ref={(el) => { btn_textarea.current[counter] = el }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <ReactDiffViewer
                    oldValue={text.source_content}
                    newValue={text.target_content}
                    splitView={true}

                />

                <div className="flex items-center justify-between gap-3 max-lg:flex-col">
                    <div className="flex gap-1">
                        <button className="btnShow  btn-sm bg-[#ffbb28] rounded w-52" onClick={() => showDiff(counter)} ref={(el) => show_btn.current[counter] = el}>Afficher la différence</button>
                        <button className="btnHide  btn-sm bg-[#ffbb28] rounded text-white w-52" onClick={() => hideDiff(counter)} ref={(el) => hide_btn.current[counter] = el}>Cacher la différence</button>
                    </div>

                    {/* Si l'email existe, cela veut dire que l'utilisateur est un valideur */}

                    {role === 'Administrateur' && <div className=" flex gap-3 items-center  max-lg:flex-col pr-3">
                            {/* {text.validate && text.validate === 1? <span className="bg-[#75f595] p-1 rounded shadow-lg">Validé</span>:<span className="bg-[#fd9e91] p-1 rounded">Non validé</span>}  */}
                            {text.evaluate?<span className="bg-[#75f595] p-1 rounded">{text.evaluate}</span>:<span className="bg-[#fd9e91] p-1 rounded">Non évalué</span>}
                        
                        
                        
                    </div>}

                    {/* {role === 'Validateur' && <div className=" flex gap-3 items-center  max-lg:flex-col">
                        <div className=" flex gap-3 items-center px-[3px] btn btn-sm btn-outline hover:text-white">
                            <label htmlFor={`check${counter}`}>Valider</label>
                            <input
                                defaultChecked={text.validate}
                                type="checkbox"
                                id={`check${counter}`}
                                className="checkbox-warning checkbox"
                                onChange={(e) => handleValidate(e, text.id)}
                                ref={(el) => check.current[counter] = el} />
                        </div>
                        <div className="flex gap-1  items-center max-lg:flex-col ">
                        Évaluation: <p className="rounded-3xl mx-1 p-2 bg-slate-500 text-white">{text.evaluate}</p>
                        </div>
                    </div>} */}



                    {/* Les radios button seront affichés lorsque l'utilisateur est un annotateur */}
                    {role === 'Annotateur' &&
                        <div className="flex items-center gap-4 px-4 max-lg:flex-col">
                            <button className="rounded btn-sm bg-[#DE9800] text-white w-52" onClick={() => { addComment(counter) }} ref={(el) => add_comment.current[counter] = el}>Ajouter un commentaire</button>
                            <button className="rounded btn-sm bg-[#DE9800] text-white w-52 save-comment" onClick={() => { saveComment(counter, text.ID) }} ref={(el) => save_comment.current[counter] = el}>Enregistrer</button>
                            <div className="flex items-center gap-4 px-4 border rounded-md">

                                <div className="label-radio">
                                    <label htmlFor={`yes${counter}`}>Oui</label>
                                    <input
                                        type="radio"
                                        id={`yes${counter}`}
                                        name={`eval$${counter}`}
                                        value="Oui"
                                        onChange={(e) => { handleRadio(e, text.ID) }}
                                        defaultChecked={text.evaluate === 'Oui'}
                                    />
                                </div>
                                <div className="label-radio">
                                    <label htmlFor={`no${counter}`}>Non</label>
                                    <input
                                        type="radio"
                                        id={`no${counter}`}
                                        name={`eval$${counter}`}
                                        value="Non"
                                        onChange={(e) => { handleRadio(e, text.ID) }}
                                        defaultChecked={text.evaluate === 'Non'}
                                    />
                                </div>
                                <div className="label-radio">
                                    <label htmlFor={`doubtful${counter}`}>Douteux</label>
                                    <input
                                        type="radio"
                                        id={`doubtful${counter}`}
                                        name={`eval$${counter}`}
                                        value="Douteux"
                                        onChange={(e) => { handleRadio(e, text.ID) }}
                                        defaultChecked={text.evaluate === 'Douteux'}
                                    />
                                </div>
                            </div>

                        </div>

                    }

                </div>

            </div>
            
                <Modal isOpen={isError} onClose={closeModal} bg="bg-red-200">
                    <p className="mb-3">Cet alignement n'est pas encore evalué. Évaluez le pour pouvoir ajouter un commentaire! </p>
                </Modal>
        </div>
    )
}


