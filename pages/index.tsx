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
      <div className={`row color-tree ${styles.titlePanel}`}>
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
    </Layout>
      
  )
}
