import '../styles/globals.css'
import Navbar from '../components/Navbar'

const Web3 = require("web3")

function MyApp({ Component, pageProps }) {

  // if (typeof window !== 'undefined') {
  //   //here `window` is available
  //   window.addEventListener('load', function() {

  //     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      
  
  //     // Now you can start your app & access web3 freely:
  //     //startApp()
  
  //   })
  // }

  function metaLogin() {
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
      ethereum.enable().then(function (accounts) {
        // You now have an array of accounts!
        // Currently only ever one:
        // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
        console.log(accounts)
      }).catch(function (error) {
        // Handle error. Likely the user rejected the login
        console.error(error)
      })
    } else {
      console.log("No web3? You should consider trying MetaMask!")
      // Handle the case where the user doesn't have Metamask installed
      // Probably show them a message prompting them to install Metamask
    }
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-slate-500 opacity-4 bg-transparent">
      <Navbar />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
