function MintCard(props) {

    function handleClick() {
        props.onDelete(props.id)
    }

    return (
        <>
        <div className="bg-white">
            <h1>Request #{props.id + 1}</h1>
            <p>ItemNumber: {props.itemNumber}</p>
            <p>Url: <a href={props.url}>{props.url}</a></p>
            <p>Unlimited Transfers: {props.unlimitedTransfers ? "True" : "False"}</p>
            <p>Transfers: {props.transfers}</p>
            <p>Period: {props.period}</p>
            <button onClick={handleClick}>DELETE</button>
        </div>
        </>
    )
}

export default MintCard