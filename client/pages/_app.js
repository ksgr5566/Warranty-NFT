import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  return <Component {...pageProps} />
}

export default MyApp
