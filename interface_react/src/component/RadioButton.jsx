
export default function RadioButton({ id, setRadioValue, onClick }) {
    const role = localStorage.getItem('role')
    console.log(role);
    return (
        <>
            {role === 'Annotateur' && <div className="radio-btn">
                <div className="label-radio">
                    <label htmlFor={`yes${id}`} className="mr-2">Correct </label>
                    <input type="radio" id={`yes${id}`} name={`eval$${id}`} value="Correct" onChange={(e) => { setRadioValue(e.target.value) }} />
                </div>
                <div className="label-radio">
                    <label htmlFor={`no${id}`} className="mr-2">Incorrect</label>
                    <input type="radio" id={`no${id}`} name={`eval$${id}`} value="Incorrect" onChange={(e) => { setRadioValue(e.target.value) }} />
                </div>
                <div className="label-radio">
                    <label htmlFor={`doubtful${id}`} className="mr-2">Pas sûr</label>
                    <input type="radio" id={`doubtful${id}`} name={`eval$${id}`} value="Pas sûr" onChange={(e) => { setRadioValue(e.target.value) }} />
                </div>
            </div>}
        </>

    )
}
