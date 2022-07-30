import GithubSvg from "./svgs/GithubSvg"

function Footer() {
  return (
    <footer className="bottom-0  p-4 w-full border-t shadow md:p-6 flex justify-between border-gray-600 ">
    <p className="font-bold ">MIT LICENSE &copy; 2022 WarNT</p>
    <a className="font-bold" href="https://github.com/ksgr5566/Warranty-NFT" target="_blank" rel="noopener"><GithubSvg /></a>
    </footer>
  )
}

export default Footer