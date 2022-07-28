import Router, { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Loading from "../components/Loading";
import Error from "../components/Error";
import SearchCard from "../components/SearchCard";
import IdCard from "../components/IdCard";

import { web3, contract } from "../utils/config";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function Details() {
  const router = useRouter();
  const id = router.query.id;

  const [query, setQuery] = useState("");
  const [start, setStart] = useState(false);

  const { data, error } = useSWR(
    start ? `/api/${query}?${query}=${id}` : null,
    fetcher
  );

  const address0 = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    async function checkId() {
      if (id !== undefined) {
        if (web3.utils.isAddress(id)) {
          setQuery("address");
          setStart(true);
        } else if (id > 0) {
          await contract.methods.idToWarranty(id).call((err, res) => {
            if (res) {
              setQuery("id");
              setStart(true);
            } else {
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

  if (error) {
    return <Error />;
  }

  if (!data) {
    return (
      <div className="mt-16">
        <Loading content="Please wait while your query is being processed." />
      </div>
    );
  }

  const response = data.responseObject;

  return query === "id" ? (
    <>
      <div>
        <IdCard
          creator={
            response.warrantyDetails.creator === address0
              ? "This token is decayed or has not been minted yet"
              : response.warrantyDetails.creator
          }
          owner={
            response.warrantyDetails.currentOwner === address0
              ? "No Owner"
              : response.warrantyDetails.currentOwner
          }
          isn={response.warrantyDetails.itemSerialNumber}
          url={response.warrantyDetails.uri}
          unlimited={
            response.warrantyDetails.unlimitedTransfers ? "True" : "False"
          }
          transfers={response.warrantyDetails.numOfTransfersAvailable}
          period={response.warrantyDetails.period}
          time={
            response.warrantyDetails.timestamp == 0
              ? "Not yet set"
              : new Date(response.warrantyDetails.timestamp * 1000).toString()
          }
          approved={
            response.approvedAddress === address0
              ? "None"
              : response.approvedAddress
          }
        />
        <div className="m-4 block p-6  rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:bg-black">
          <h1 className="font-bold wx-4 px-6 py-1">Replacement Details</h1>
          {response.replacementDetails.at ? (
            <div className="bet:px-6 py-1 px-0">
              <h2 className="font-serif text-gray-400 p-1">At:</h2>
              <p className="font-serif text-gray-400 p-1">
                {response.replacementDetails.at}
              </p>
              <h2 className="font-serif text-gray-400 p-1">Replaced the Id:</h2>
              <p className="font-serif text-gray-400 p-1">
                {response.replacementDetails.prevId}
              </p>
            </div>
          ) : (
            <p className="font-serif text-gray-400 bet:px-6 py-1 px-0">
              This item has not replaced any item.
            </p>
          )}
        </div>

        <div className="m-4 block p-6  rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:bg-black overflow-x-auto ">
          <h1 className="font-bold wx-4 px-6 py-1">Warrenty Details</h1>
          {response.repairDetails.length === 0 ? (
            <p className="font-serif text-gray-400 bet:px-6 py-1 px-0">
              No repairs done on this item.
            </p>
          ) : (
            <div className="bet:px-6 py-1 px-0">
              {response.repairDetails.map((obj, index) => {
                return (
                  <div className="border-soild border-gray-400 border-2 border-x-0 my-2 sm:p-2">
                    <h2 className="font-serif text-gray-400 p-1">{`Repair ${
                      index + 1
                    }`}</h2>
                    <h2 className="font-serif text-gray-400 p-1">Time:</h2>
                    <p className="font-serif text-gray-400 p-1">{obj.at} </p>
                    <h2 className="font-serif text-gray-400 p-1">Title:</h2>
                    <p className="font-serif text-gray-400 p-1">{obj.title} </p>
                    <h2 className="font-serif text-gray-400 p-1">Content:</h2>
                    <p className="font-serif text-gray-400 p-1">
                      {obj.content}{" "}
                    </p>{" "}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="m-4 block p-6  rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:bg-black overflow-x-auto">
          <h1 className="font-bold wx-4 px-6 py-1">Transaction History</h1>
          <div className="bet:px-6 py-1 px-0">
          {response.transactionHistory.map((obj, index) => {
                return (
                  <div className="border-y-soild border-gray-400 border-2 border-x-0 my-2 sm:p-2">
                    <h2 className="font-serif text-gray-400 p-1">{`Transaction ${
                      index + 1
                    }`}</h2>
                    <h2 className="font-serif text-gray-400 p-1">Time:</h2>
                    <p className="font-serif text-gray-400 p-1">{obj.at} </p>
                    <h2 className="font-serif text-gray-400 p-1">From:</h2>
                    <p className="font-serif text-gray-400 p-1">{obj._from === address0 ? "Creation, from null." : obj._from} </p>
                    <h2 className="font-serif text-gray-400 p-1">To:</h2>
                    <p className="font-serif text-gray-400 p-1">
                      {obj._to}{" "}
                    </p>{" "}
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="select-none">
        <h1 className="text-center text-xl font-bold font-mono mb-4 mt-8">
          Creator of:
        </h1>
        {response.creator.length === 0 ? (
          <p className="text-center p-6">Empty Collection.</p>
        ) : (
          <div className="grid sm:grid-cols-2 bet:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 grid-cols-1">
            {response.creator.map((id, index) => {
              return <SearchCard id={id} />;
            })}
          </div>
        )}
        <h1 className="text-center text-xl font-bold font-mono mb-4 mt-8">
          Owner of:
        </h1>
        {response.owner.length === 0 ? (
          <p className="text-center p-6">Empty Collection.</p>
        ) : (
          <div className="grid sm:grid-cols-2 bet:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 grid-cols-1">
            {response.owner.map((id, index) => {
              return <SearchCard id={id} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Details;
