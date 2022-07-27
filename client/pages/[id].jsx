import Router, { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Loading from '../components/Loading'

import { web3, contract } from "../utils/config"

function Details () {
    console.log(process.env.ALCHEMY_TESTNET_API_KEY)
    const router = useRouter()
    const id = router.query.id

    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState("")

    if (loading) {
        return (
            <Loading content="Please wait while your query is being processed." />
        )
    }

    useEffect (async () => {
        const address0 = "0x0000000000000000000000000000000000000000"
        if(web3.utils.isAddress(id)) {
            setQuery("address")
        } else {
            if (id > 0) {
                await contract.methods.idToWarranty(id).call((err, res)=>{
                    if(err) console.log(err)
                    else if (res.creator !== address0) setQuery("tokenId")
                })
            } 
            alert("This id is not existing.")
            Router.push("/") 
        }
    }, [])

    if (query === "tokenId") {
        contract.methods.idToWarranty(id).call((err, res)=>{
            if(err) {
                console.log(err)
            } else {
                console.log(res)
            }
        })
    }

    if (query === "address") {
    
    }

    /* <h1>{idDetails.creator}</h1>
    <h1>{idDetails.itemSerialNumber}</h1> */ 
}

export default Details