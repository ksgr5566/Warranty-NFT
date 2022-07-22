import { HomeIcon } from "@heroicons/react/outline"
import HeaderItem from "./HeaderItem"

function Header() {
  return (
    <>
    <header className="">
        <HeaderItem title='HOME' Icon={HomeIcon}/>
    </header>
    <div className="flex">
    <div>
        <span>
            WARNT
        </span>
    </div>
    <div className="bg-green-500 flex-1 flex justify-end">
        <a>Home1</a>
        <a>Home2</a>
        <a>Home3</a>
        <a>Home4</a>
    </div>
    </div>
    
    </>
  )
}

export default Header