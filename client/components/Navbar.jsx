import Link from "next/link"
import MetaFox from "./svgs/MetaFox"
import Search1 from "./svgs/Search1"
import Search2 from "./svgs/Search2"
import Warranty from "./svgs/Warranty"
import { useState, useEffect, useContext } from "react"
import { LoginContext } from "../contexts/LoginContext"
import Router from 'next/router'

function Navbar() {

  const [activeLink, setActiveLink] = useState("")
  const [searchContent, setSearchContent] = useState("")

  const { account, loginStatus, handleLogin } = useContext(LoginContext)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveLink(window.location.pathname)
      window.addEventListener('load', function (event) {
        setActiveLink(window.location.pathname)
      })
      window.addEventListener('popstate', function (event) {
        setActiveLink(window.location.pathname)
      })
      Router.events.on('routeChangeStart', (url, { shallow }) => {
        setActiveLink(url)
      })
    }
  }, [])

  function onNavClick(path) {
    setActiveLink(path)
  }

  function handleChange(event) {
    const { value } = event.target
    setSearchContent(value)
  }

  function submit (e) {
    Router.push({
      pathname: `/${searchContent}`,
    })
    setSearchContent("")
    e.preventDefault()
  }

  return (
    <>
      <div className="flex justify-between flex-wrap select-none">
        <div className="p-6 mt-2">
          <Link href="/">
            <a onClick={e => onNavClick("/")}>
              <Warranty />
              <span className="font-bold">WarNT</span>
            </a>
          </Link>
        </div>
        <form className="flex items-center justify-center mx-auto order-2 md:order-1 px-4">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative max-w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <Search1 />
            </div>
            <input
              type="text"
              id="simple-search"
              onChange={handleChange}
              value={searchContent}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 sm:w-96 xs:w-72 2xs:w-60 w-full"
              placeholder="0x.../tokenId"
              required
            />
          </div>
          <button
            type="submit"
            onClick={submit}
            className="hidden sm:inline p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <Search2 />
            <span className="sr-only">Search</span>
          </button>
        </form>
        <button
          type="button" onClick={handleLogin}
          className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-full sm:rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mx-6 my-8 sm:my-10 md:order-2"
        >
          <span className="sm:hidden">
          {loginStatus ? (<span></span>) : (<MetaFox />) }
          </span>
          <span className="hidden sm:inline">
            <MetaFox />
          </span>
          <span className="hidden sm:inline">
          {!loginStatus ? "Connect with MetaMask" : account.slice(0,19) + "..."}
          </span>
          <span className="sm:hidden">
          {loginStatus ? account.slice(0,4) + "..." : ""}
          </span>
        </button>
      </div>

      <nav className="select-none sm:border-b pt-2 overflow-x-scroll sm:overflow-hidden pb-3 flex sm:justify-center md:border scrollbar md:justify-end">
          <Link href="/">
            <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600" onClick={e => onNavClick("/")}>
              {activeLink === "/" ? (<span className="font-bold text-slate-300">Home</span>) : "Home"}
            </a>
          </Link>
          <Link href="/mint">
            <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600" onClick={e => onNavClick("/mint")}>
              {activeLink === "/mint" ? (<span className="font-bold text-slate-300">Mint</span>) : "Mint"}
            </a>
          </Link>
          <Link href="/transfer">
            <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600" onClick={e => onNavClick("/transfer")}>
              {activeLink === "/transfer" ? (<span className="font-bold text-slate-300">Transfer</span>) : "Transfer"}
            </a>
          </Link>
          <Link href="/approve">
            <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600" onClick={e => onNavClick("/approve")}>
              {activeLink === "/approve" ? (<span className="font-bold text-slate-300">Approve</span>) : "Approve"}
            </a>
          </Link>
          <Link href="/decay">
            <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600" onClick={e => onNavClick("/decay")}>
              {activeLink === "/decay" ? (<span className="font-bold text-slate-300">Decay</span>) : "Decay"}
            </a>
          </Link>
          <a className="rounded-lg px-3 py-2 border-solid hover:bg-slate-800 border-indigo-600 md:mr-4" href="https://github.com/ksgr5566/Warranty-NFT/blob/master/client/API.md" target="_blank" rel="noopener">
            Docs
          </a>
      </nav>
    </>
  );
}

export default Navbar;
