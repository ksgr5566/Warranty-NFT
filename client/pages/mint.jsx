import { useState } from "react"

import CreateMintForm from "../components/CreateMintForm"
import MintCard from "../components/MintCard"

function mint() {
  const [forms, setForms] = useState([])

  function addForm(newForm) {
    setForms((prevForms) => {
      return [...prevForms, newForm]
    })
  }

  function deleteForm(id) {
    setForms((prevForms) => {
      return prevForms.filter((form, index) => index !== id);
    })
  }

  return (
    <>
      <CreateMintForm onAdd={addForm} />
      {forms.map((form, index) => {
        return (
          <MintCard
            key={index}
            id={index}
            itemNumber={form.itemNumber}
            url={form.url}
            unlimitedTransfers={form.unlimitedTransfers}
            transfers={form.transfers}
            period={form.period}
            onDelete={deleteForm}
          />
        )
      })}
    </>
  )
}

export default mint;
