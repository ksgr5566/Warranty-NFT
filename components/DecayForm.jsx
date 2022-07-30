import { useState } from "react";

function CreateDecayForm({ onSubmit, buttonStatus }) {
  const [form, setForm] = useState({
    tokenId: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    let x = value;
    setForm((prevState) => {
      return {
        ...prevState,
        [name]: x,
      };
    });
  }

  function handleSubmit(e) {
    onSubmit(form);
    setForm({
      tokenId: "",
    });
    e.preventDefault();
  }

  return (
    <>
      <div>
        <div className="sm:mx-20 mx-2 py-1 my-">
          <div className="sm:mx-auto mt-6 select-none">
            <h1 className="text-center font-bold font-mono mb-4">Decay NFT</h1>
            <form>
              <div className="sm:w-3/4 mx-auto max-w-full w-full">
                <div>
                  <label htmlFor="tokenId" className="sm:col-span-3">
                    Token id
                  </label>
                  <input
                    id="tokenId"
                    type="text"
                    name="tokenId"
                    placeholder="Token Id"
                    value={form.tokenId}
                    onChange={handleChange}
                    className="sm:col-span-3 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-center my-4">
                {buttonStatus && (
                  <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-cyan-800"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Decay
                    </span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateDecayForm;
