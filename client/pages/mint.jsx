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
      <div className="bg-grey grid sm:grid-cols-3 md:grid-cols-4  grid-cols-1 mx-4 my-4 gap-x-4 gap-y-4">
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
      </div>
      <div className="flex justify-center">
      <button className=" relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        Submit </span></button>
      </div>
    </>
  )
}

export default mint;
