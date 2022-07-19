import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Homey() {
  return (
    <>
     <h1>{process.env.PRIVATE_KEY || "ENV DID NOT LOAD"}</h1>
    </>
  )
}
