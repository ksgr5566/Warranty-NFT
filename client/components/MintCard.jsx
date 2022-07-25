function MintCard(props) {
  function handleClick() {
    props.onDelete(props.id)
  }

  return (
    <>
      <div className="block p-6 max-w-sm rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:bg-black">
        <div className="px-6 py-1">
          <h1 className="font-bold wx-4">Request #{props.id + 1}</h1>
        </div>
        <div className="px-6 py-1">
          <p className="font-serif text-gray-400">
            ItemNumber: {props.itemNumber}
          </p>
          <p className="font-serif text-gray-400">
            Url:{" "}
            <a href={props.url} target="_blank">
              {props.url}
            </a>
          </p>
          <p className="font-serif text-gray-400">
            Unlimited Transfers: {props.unlimitedTransfers ? "True" : "False"}
          </p>
          <p className="font-serif text-gray-400">
            Transfers: {props.transfers}
          </p>
          <p className="font-serif text-gray-400">Period: {props.period}</p>
        </div>
        <div class="px-6 py-1">
          <button
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-center rounded-lg border focus:ring-4 focus:outline-none bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-700"
            onClick={handleClick}
          >
            DELETE
          </button>
        </div>
      </div>
    </>
  )
}

export default MintCard
