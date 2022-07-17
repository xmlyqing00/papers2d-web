import Head from 'next/head'
import React from 'react'
// import styles from './layout.module.css'

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Papers2D</title>
                <meta name="description" content="Welcome to bookshelf" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container-fluid">
                {children}
            </div>
        </>
    )
}