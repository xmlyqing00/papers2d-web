import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Layout from '../components/layout'
import styles from '../styles/Index.module.css'

export default function Home() {

  const router = useRouter()
  const [queryStr, setQueryStr] = useState('')
  const handleSearch = async (event) => {
    if (queryStr.length == 0) {
      return;
    }
    event.preventDefault()
    router.push({
      pathname: '/search',
      // query: {key: event.target.query.value}
      query: {key: queryStr}
    })
  }

  const handleChange = e => {
    setQueryStr(e.target.value)
  }

  return (
    <Layout>
      <div className={`row title-color ${styles.titlePanel}`}>
        <div className="col">
          <p>Papers2D</p>
        </div>
      </div>
    
      <form onSubmit={handleSearch} className={`row justify-content-center ${styles.searchPanel}`}>
        <div className={`col-9 col-sm-10 col-md-8 col-xl-5 col-xxl-4 ${styles.searchBox}`}>
          <input 
            className={`form-control ${styles.searchInput}`} 
            onChange={handleChange}
            type="text"               
            placeholder="try: segmentation" 
          />
        </div>
        <div className="col-auto">
          <i className={`bi bi-search ${styles.searchIcon}`} onClick={handleSearch}></i>
        </div>
      </form>

      <div className={`row ${styles.sloganPanel}`}>
        <div className="col">
          <p>Discover great papers. Develop new ideas.</p>
        </div>
      </div>
{/* 
        
        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div> */}
        {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </Layout>
      
  )
}
