import Router, { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";

import { web3, contract } from "../utils/config";

function Details() {
  const router = useRouter();
  const id = router.query.id;

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    async function checkId() {
      if (id !== undefined) {
        const address0 = "0x0000000000000000000000000000000000000000";
        if (web3.utils.isAddress(id)) {
          setQuery("address");
        } else if (id > 0) {
          await contract.methods.idToWarranty(id).call((err, res) => {
            console.log(res);
            if (res.creator !== address0) setQuery("tokenId");
            else {
              if (err) console.log(err);
              alert("This id is not existing.");
              Router.push("/");
            }
          });
        } else {
          alert("This id is not existing.");
          Router.push("/");
        }
      }
    }
    checkId();
  }, [id]);

  if (loading) {
    return (
      <Loading content="Please wait while your query is being processed." />
    );
  }

  if (query === "tokenId") {
    
  }

  // if (query === "tokenId") {
  //     contract.methods.idToWarranty(id).call((err, res)=>{
  //         if(err) {
  //             console.log(err)
  //         } else {
  //             console.log(res)
  //         }
  //     })
  // }

  // if (query === "address") {

  // }

  /* <h1>{idDetails.creator}</h1>
    <h1>{idDetails.itemSerialNumber}</h1> */
}

export default Details;
