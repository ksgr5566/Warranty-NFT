import CreateMintForm from '../components/CreateMintForm'
import { useState } from "react"

function mint() {
    const [forms, setForms] = useState([])

    function addForm(newForm) {
        setForms(prevForms => {
            return [...prevForms, newForm]
        })
    }

    function deleteForm(id) {
        setForms(prevForms => {
            return prevForms.filter(form => form.id !== id)
        })
    }

    return (
        <>
        <CreateMintForm onAdd={addForm} />
        {
            forms.map((form, index) => {
                return (
                    <div key={index}>
                        <p>{form.itemNumber}</p>
                        <p>{form.url}</p>
                        <p>{form.unlimitedTransfers}</p>
                        <p>{form.transfers}</p>
                        <p>{form.period}</p>
                        <button onClick={() => deleteForm(form.id)}>Delete</button>
                    </div>
                )
            })
        }
        </>
    )
}

export default mint