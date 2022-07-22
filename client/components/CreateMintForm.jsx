import { useState } from "react"

function CreateMintForm ({onAdd}) {

    const [form, setForm] = useState({
        itemNumber: "",
        url: ""
    })

    function handleChange(event) {
        const { name, value } = event.target
        setForm(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    function addForm(event) {
        onAdd(form)
        setForm({
            itemNumber: "",
            url: ""
        })
        event.preventDefault()
    }

    return (
      <>
      <div>
        <form>
            <input 
                type="text"
                name="itemNumber"
                value={form.itemNumber}
                placeholder="Item Number"
                onChange={handleChange}
            />
            <input 
                type="url"
                name="url"
                value={form.url}
                placeholder="URL"
                onChange={handleChange} 
            />
            <button onClick={addForm}>Add</button>
        </form>
      </div>
      </>
    )
  }
  
  export default CreateMintForm