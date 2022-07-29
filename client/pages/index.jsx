export default function Home() {
  return (
    <div className="md:mx-auto bet:mx-8 mx-2 mt-6 ">
      <div className="p-4 w-full text-center bg-white rounded-lg border shadow-md sm:p-8 ">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 ">
          Welcome to WarNT
        </h1>
        <p className="mb-5 text-base text-gray-500 sm:text-lg ">
          You can <em>Mint</em>, <em>Transfer</em>, <em>Approve</em>,{" "}
          <em>Decay</em>, your WarNT NFTs here.
        </p>
        <p className="mb-5 text-base text-gray-900 sm:text-lg ">
          It is Recommended to:
        </p>
        <p className="mb-5 text-base text-gray-500 sm:text-lg ">
          Use our API to perform the above specified functions as well as emit{" "}
          <em>Repair</em> and <em>Replace</em> events, please read the docs{" "}
          <a className="text-blue-400" href="https://github.com/" target="_blank">here</a>.
        </p>
        <div class="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4"></div>
      </div>
    </div>
  );
}
