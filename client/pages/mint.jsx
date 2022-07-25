import { useState, useContext } from "react"
import { LoginContext } from "../contexts/LoginContext"

import CreateMintForm from "../components/CreateMintForm"
import MintCard from "../components/MintCard"

import { ethers } from "ethers"
import Web3Modal from "web3modal"

import { contractAddress, abiFile } from "../utils/config"

function Mint() {
  const [forms, setForms] = useState([])
  const { account, loginStatus } = useContext(LoginContext)

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

  function handleSubmit() {
    if (!loginStatus) {
      alert("You must be logged in to Mint.")
      return
    }

    forms.forEach(async (form) => {
        mint(form.itemNumber, form.url, form.unlimitedTransfers, form.transfers, form.period)
    })

    setForms([])
  }

  async function mint(itemNumber, url, unlimitedTransfers, transfers, period) {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abiFile.abi, signer)

    await contract.mint(itemNumber, url, unlimitedTransfers, transfers, period)
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
      {forms.length !== 0 && (
        <div className="flex justify-center">
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-cyan-800"
            onClick={handleSubmit}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Submit{" "}
            </span>
          </button>
        </div>
      )}
    </>
  )
}

export default Mint
