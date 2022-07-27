import { useState, useContext } from "react"
import { LoginContext } from "../contexts/LoginContext"

import CreateMintForm from "../components/CreateMintForm"
import MintCard from "../components/MintCard"
import Loading from "../components/Loading"

import Web3Modal from "web3modal"
import Web3 from "web3"

import { contractAddress, abiFile } from "../utils/config"

function Mint() {
  const [forms, setForms] = useState([])
  const { account, loginStatus } = useContext(LoginContext)

  const [status, setStatus] = useState("submit")
  const [loading, setLoading] = useState(false)

  const [receipts, setReceipts] = useState([])

  function addForm(newForm) {
    if (status === "clear") {
      alert("Please clear the receipts to add new form.")
      return
    }
    setForms((prevForms) => {
      return [...prevForms, newForm]
    })
  }

  function deleteForm(id) {
    setForms((prevForms) => {
      return prevForms.filter((form, index) => index !== id)
    })
  }

  async function handleSubmit() {
    if (status === "clear") {
      setReceipts([])
      setStatus("submit")
      return
    }
    if (!loginStatus) {
      alert("You must be logged in to Mint.")
      return
    }
    setLoading(true)
    try {
      await mint()
      setStatus("clear")
    } catch (e) {
      console.log(e)
      setStatus("submit")
    } finally {
      setForms([])
      setLoading(false)
    }
  }

  async function mint() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const web3 = new Web3(connection)
    const contract = new web3.eth.Contract(abiFile.abi, contractAddress)
    const receipt = await contract.methods.multipleMint(forms).send({
      from: account,
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
      gasLimit: web3.utils.toHex(1000000),
    })
    let tokens = []

    function getId(index) {
      return forms.length === 1
        ? receipt.events.Transfer.returnValues._tokenId
        : receipt.events.Transfer[index].returnValues._tokenId
    }

    forms.forEach((form, index) => {
      tokens.push({
        itemNumber: form.itemSerialNumber,
        tokenId: getId(index),
      })
    })
    setReceipts(tokens)
  }

  return (
    <>
      <CreateMintForm onAdd={addForm} />
      <div className="bg-grey grid sm:grid-cols-2 md:grid-cols-3  grid-cols-1 mx-4 my-4 gap-x-4 gap-y-4">
        {status &&
          !loading &&
          forms.map((form, index) => {
            return (
              <MintCard
                key={index}
                id={index}
                itemNumber={form.itemSerialNumber}
                url={form.uri}
                unlimitedTransfers={form.unlimitedTransfers}
                transfers={form.numOfTransfers}
                period={form.period}
                onDelete={deleteForm}
              />
            )
          })}
        {receipts.length !== 0 &&
          receipts.map((receipt, index) => {
            return (
              <MintCard
                key={index}
                id={index}
                status={status}
                itemNumber={receipt.itemNumber}
                tokenId={receipt.tokenId}
              />
            )
          })}
      </div>

      {loading && ( <Loading content="Your transaction is being processed. Please wait." /> )}

      {(forms.length !== 0 || receipts.length !== 0) && !loading && (
        <div className="flex justify-center">
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-cyan-800"
            onClick={handleSubmit}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
              {status !== "submit" ? "Clear" : "Submit"}
            </span>
          </button>
        </div>
      )}
    </>
  )
}

export default Mint
