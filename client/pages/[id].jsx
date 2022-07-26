import Router, { useRouter } from 'next/router'
import { useState } from 'react'

import { web3, contract } from "../utils/config"

function checkId(id) {
    const address0 = "0x0000000000000000000000000000000000000000"
    if(web3.utils.isAddress(id)) {
        return "address"
    }
    if (id > 0) {
        return new Promise ((resolve, reject) => {
            contract.methods.idToWarranty(id).call((err, res)=>{
                if(err) {
                    console.log(err)
                } else {
                    if (res.creator === address0) {
                        alert("This id is not existing.")
                        Router.push("/")
                    } else {
                        resolve("tokenId")
                    }
                }
            })
        })
    } 
}

function Details () {
    console.log(process.env.ALCHEMY_TESTNET_API_KEY)
    const router = useRouter()
    const id = router.query.id
    const query = checkId(id).then(res => res)

    let idDetails

    if (query === "tokenId") {
        contract.methods.idToWarranty(id).call((err, res)=>{
            if(err) {
                console.log(err)
            } else {
                idDetails = res
                console.log(idDetails)
                console.log(res)
            }
        })
    }

    return query === "address" ? (
    <>

    </>) 
    : (<>
    {/* <h1>{idDetails.creator}</h1>
    <h1>{idDetails.itemSerialNumber}</h1> */}
    </>)
}

export default Details