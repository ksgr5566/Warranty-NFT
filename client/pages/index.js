import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Warranty NFT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/warranty.ico" />
      </Head>
      <h1>Lets build Warranty-NFT!</h1>
      <Header />
    </div>
  )
}
