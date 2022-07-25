import { useState } from "react";

function CreateMintForm({ onAdd }) {
  const [form, setForm] = useState({
    itemNumber: "",
    url: "",
    unlimitedTransfers: false,
    transfers: "",
    period: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    let x = value;
    if ((name === "transfers" || name === "period") && value < 0) x = "";
    setForm((prevState) => {
      return {
        ...prevState,
        [name]: x,
      };
    });
  }

  function addForm(event) {
    onAdd(form);
    setForm({
      itemNumber: "",
      url: "",
      unlimitedTransfers: false,
      transfers: "",
      period: "",
    });
    event.preventDefault();
  }

  return (
    <>
      <div className="m-14 select-none">
        <h1 className="text-center font-bold font-mono mb-4">Fill Warranty Details</h1>
        <form className="">
          <div className="w-3/4 mx-auto max-w-full">
            <div className="grid sm:grid-cols-1 grid-cols-1 gap-y-2">
              {/* <div className="grid grid-cols-2"><div className="grid grid-cols-1"> */}
              <label htmlFor="itemNumber" className="mx-auto">Item Number</label>
              <input
                id="itemNumber"
                type="text"
                name="itemNumber"
                value={form.itemNumber}
                placeholder="Item Number"
                onChange={handleChange}
                // className="sm:w-1/2 xs:w-72 2xs:w-60 w-full border border-gray-300 rounded-lg mx-auto"
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 bg-slate-200"
              />
           {/* </div> */}
        {/* <div className="grid grid-cols-1"> */}
              <label htmlFor="url" className="mx-auto">URL</label>
              <input
                type="url"
                name="url"
                id="url"
                value={form.url}
                placeholder="URL"
                onChange={handleChange}
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 p-2.5 bg-slate-200"
              />
           {/* </div></div> */}
           <div className="grid gap-1 grid-cols-3 " >
            <div className="grid  grid-cols-1">
              <label htmlfor="unlimitedTransfers"  className="mx-auto" >Unlimited Transfers?</label>
              <select
                id="unlimitedTransfers"
                name="unlimitedTransfers"
                onChange={handleChange}
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/4 p-2.5 bg-slate-200"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              </div>
           <div className="grid grid-cols-1">
              <label htmlFor="transfers"  className="mx-auto">Transfers</label>
              <input
                type="number"
                name="transfers"
                id="transfers"
                value={form.transfers}
                placeholder="Number of Transfers"
                onChange={handleChange}
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-4/6 p-2.5 bg-slate-200"
              />
              </div>
              <div className="grid grid-cols-1">
              <label htmlfor="period" className="mx-auto">Period</label>
              <input
                type="number"
                name="period"
                id="period"
                value={form.period}
                placeholder="Period"
                onChange={handleChange}
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 bg-slate-200"
              />
              </div>
           
           </div>
           </div>
             
          </div>

          <div className="flex justify-center py-3 ">
          <button className = "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" type="submit" onClick={addForm}>Add</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateMintForm;
