import Link from 'next/link'

export default function Navbar () {
    return (
        <>
        <nav className="flex p-3">
            <div className="bg-black">  
                <span className="text-xl text-yellow-700 font-bold tracking-wide">
                    WARNT
                </span>
            </div>
            <div className="flex justify-end bg-green-300"> 
                <Link href="/">
                    <a className="">Home</a>
                </Link>
                <Link href="/">
                    <a>Mint</a>
                </Link>
                <Link href="/">
                    <a>Transfer</a>
                </Link>
                <Link href="/">
                    <a>Approve</a>
                </Link>
                <Link href="/">
                    <a>Decay</a>
                </Link>
            </div> 
        </nav>
        </>
    )
}