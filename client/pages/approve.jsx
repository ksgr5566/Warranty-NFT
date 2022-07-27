import { useState, useContext } from "react"
import { contractAddress, abiFile } from "../utils/config"
import { LoginContext } from "../contexts/LoginContext"

import Web3Modal from "web3modal"
import Web3 from "web3"

import ApproveForm from "../components/ApproveForm"
import Loading from "../components/Loading"

function Approve(){

    const [loading, setLoading] = useState(false)
    const { account, loginStatus } = useContext(LoginContext)
    const [buttonVisibility, setButtonVisibility] = useState(true)

    async function submit(form) {
        if (!loginStatus) {
            alert("You must be logged in to Approve.")
            return
        }
        setButtonVisibility(false)
        setLoading(true)
        try {
            await approve(form)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            setButtonVisibility(true)
        }
    }

    async function approve({approved, tokenId}) {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const web3 = new Web3(connection)
        const contract = new web3.eth.Contract(abiFile.abi, contractAddress)
        const receipt = await contract.methods.approve(approved, tokenId).send({
            from: account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            gasLimit: web3.utils.toHex(1000000),
        })
        console.log(receipt)
    }

    return(<>
        <ApproveForm onSubmit={submit} buttonStatus={buttonVisibility} />
        {loading && <Loading content="Please wait while your transaction is being processed." />}
    </>)
}
export default Approve