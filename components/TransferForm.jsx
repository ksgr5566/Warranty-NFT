import { useState } from "react"

function TransferForm({ onSubmit, buttonStatus }){
  const[form , setForm] = useState({
    to: "",
    tokenId: "",
    mobileNumber:""
  })

  function handleChange(event) {
    const {name, value} = event.target
    let x = value
    setForm(prevState => {
        return {
          ...prevState,
          [name]: x
        }
    })
  }

  function handleSubmit(e) {
    onSubmit(form)
    setForm({
      to: "",
      tokenId: "",
      mobileNumber:""
    })
    e.preventDefault()
  }

return(

    <div className="sm:mx-20 mx-2 py-1 my-" >
     <div className="sm:mx-auto mt-6 select-none">
      <h1 className="text-center font-bold font-mono mb-4">
          Transfer NFT 
        </h1>
        <form>
        <div className="sm:w-3/4 mx-auto max-w-full w-full" >
        <div>
        <label htmlFor="toAddreess" className="sm:col-span-3">
               Reciever Public Key 
              </label>
              <input
                id="to"
                type="text"
                name="to"
                placeholder="Reciever public key"
                onChange={handleChange}
                value={form.to}
                className="sm:col-span-3 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-slate-200"
              />
        </div>
        <div className="my-4">
        <label htmlFor="tokenId" className="sm:col-span-3">
            Token id
        </label>
            <input 
                id="tokenId"
                type="text"
                name="tokenId"
                placeholder="Token id"
                onChange={handleChange}
                value={form.tokenId}
                className="sm:col-span-3 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-slate-200"
            />
            </div>
            <div className="my-4">
        <label htmlFor="tokenId" className="sm:col-span-3">
            Mobile Number
        </label>
            <input 
                id="mobileNumber"
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                onChange={handleChange}
                value={form.mobileNumber}
                className="sm:col-span-3 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-slate-200"
            />
            </div>
            </div>
            <div className="flex justify-center">
          {buttonStatus && (
            <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-cyan-800"
            type="submit" onClick={handleSubmit}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Transfer
            </span>
          </button>
          )}
        </div>
        </form>
     </div>
    </div>

)
}

export default TransferForm;