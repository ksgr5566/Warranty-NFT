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
        <h1 className="text-center font-bold mb-4">Fill Warranty Details</h1>
        <form className="">
          <div className="w-3/4 mx-auto max-w-full">
            <div className="grid sm:grid-cols-1 grid-cols-1 gap-y-2">
              <div className="grid grid-cols-2"><div className="grid grid-cols-1">
              <label htmlFor="itemNumber" className="mx-auto">Item Number</label>
              <input
                id="itemNumber"
                type="text"
                name="itemNumber"
                value={form.itemNumber}
                placeholder="Item Number"
                onChange={handleChange}
                className="sm:w-1/2 xs:w-72 2xs:w-60 w-full border border-gray-300 rounded-lg mx-auto"
              />
           </div>
        <div className="grid grid-cols-1">
              <label htmlFor="url" className="mx-auto">URL</label>
              <input
                type="url"
                name="url"
                id="url"
                value={form.url}
                placeholder="URL"
                onChange={handleChange}
                className="border mx-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 bg-slate-200"
              />
           </div></div>
          
              <label htmlfor="unlimitedTransfers">Unlimited Transfers?</label>
              <select
                id="unlimitedTransfers"
                name="unlimitedTransfers"
                onChange={handleChange}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
           
              <label htmlFor="transfers">Transfers</label>
              <input
                type="number"
                name="transfers"
                id="transfers"
                value={form.transfers}
                placeholder="Number of Transfers"
                onChange={handleChange}
              />
           
              <label htmlfor="period">Period</label>
              <input
                type="number"
                name="period"
                id="period"
                value={form.period}
                placeholder="Period"
                onChange={handleChange}
              />
           
          </div>
          </div>
          <div className="flex justify-center p-4">
          <button type="submit" onClick={addForm}>Add</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateMintForm;
