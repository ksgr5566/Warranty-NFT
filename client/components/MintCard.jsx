function MintCard(props) {

    function handleClick() {
        props.onDelete(props.id)
    }

    return (
        <>

        <div className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <div class="px-6 py-1">
            <h1 className="font-bold wx-4">Request #{props.id + 1}</h1>
            </div>
            <div class="px-6 py-1">
            <p className="font-serif text-gray-700 dark:text-gray-400">ItemNumber: {props.itemNumber}</p>
            <p className="font-serif text-gray-700 dark:text-gray-400">Url: <a href={props.url} target="_blank">{props.url}</a></p>
            <p className="font-serif text-gray-700 dark:text-gray-400">Unlimited Transfers: {props.unlimitedTransfers ? "True" : "False"}</p>
            <p className="font-serif text-gray-700 dark:text-gray-400">Transfers: {props.transfers}</p>
            <p className="font-serif text-gray-700 dark:text-gray-400">Period: {props.period}</p>
            </div>
            <div class="px-6 py-1">
            <button className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700" onClick={handleClick}>DELETE</button>
            </div>
        </div>
        </>
    )
}

export default MintCard