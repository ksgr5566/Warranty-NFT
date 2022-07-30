function IdCard(props) {
  return (
    <div className="m-4 ">
      <div className="block p-6  rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:bg-black overflow-x-auto">
        <div className="px-6 py-1">
          <h1 className="font-bold wx-4">Warrenty Details</h1>
        </div>
        <div className="bet:px-6 py-1 px-0">
          <p className="font-serif text-gray-400 p-1">Creator:</p>
          <p className="font-serif text-gray-400 p-1">{props.creator}</p>
            <p className="font-serif text-gray-400 p-1">Current Owner:</p>
            <p className="font-serif text-gray-400 p-1">{props.owner}</p>
            <p className="font-serif text-gray-400 p-1">itemSerialNumber:</p>
            <p className="font-serif text-gray-400 p-1">{props.isn}</p>
            <p className="font-serif text-gray-400 p-1">Url:</p>
            <p className="font-serif text-gray-400 p-1">{props.url}</p>
            <p className="font-serif text-gray-400 p-1">unlimitedTransfers:</p>
            <p className="font-serif text-gray-400 p-1">{props.unlimited}</p>
            <p className="font-serif text-gray-400 p-1">NoOfTransfers:</p>
            <p className="font-serif text-gray-400 p-1">{props.transfers}</p>
            <p className="font-serif text-gray-400 p-1">Period:</p>
            <p className="font-serif text-gray-400 p-1">{props.period}</p>
            <p className="font-serif text-gray-400 p-1">Warenty Time:</p>
            <p className="font-serif text-gray-400 p-1">{props.time}</p>
            <p className="font-serif text-gray-400 p-1">Approved Address:</p>
            <p className="font-serif text-gray-400 p-1">{props.approved}</p>
        </div>
      </div>
    </div>
  );
}

export default IdCard;
