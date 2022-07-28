import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '../components/layout'
import styles from '../styles/Search.module.css'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'


const fetcher = (url: string, key: string) => fetch(`${url}?key=${key}`).then((res) => res.json())


export default function Search() {
  
  const router = useRouter()
  const {data, error} = useSWR(['/api/es_search', router.query.key], fetcher)
  const [queryStr, setQueryStr] = useState(router.query.key)
  const handleSearch = async (event) => {
    if (queryStr && queryStr.length > 0) {
      event.preventDefault()
      router.push({
        pathname: '/search',
        // query: {key: event.target.query.value}
        query: {key: queryStr}
      })
    }
  }
  const handleChange = e => {
    setQueryStr(e.target.value)
  }

  if (error) return <div>Failed to load, {error}</div>
  if (!data) return <div>Loading...</div>
  
  console.log(data)
  
  return (
    <Layout>
      <Header handleSearch={handleSearch} handleChange={handleChange} queryStr={queryStr}/>
      <SearchResults data={data} />
    </Layout>
  )
}


function Header({handleSearch, handleChange, queryStr}) {

  return (
    <div className={`row ${styles.searchPanel}`}>
      <div className="col-1">
        <Link href="/" >
          <p className={`title-color ${styles.title}`}>Papers2D</p>
        </Link> 
      </div>
      <div className="col-3">
        <form onSubmit={handleSearch}>
          <input className={`form-control `}
            onChange={handleChange}
            type="text"               
            placeholder="Example: Object Tracking"
            value={queryStr}
          />
        </form>
      </div>
      
      <div className="col-1">
          <i className={`bi bi-search ${styles.searchIcon}`} onClick={handleSearch}></i>
        </div>
    </div>
  )
}

function SearchResults({data}) {

  console.log(data)
  
  let title = []
  data.sort(function(a, b) {
    let keyA = new Date(a._source.year)
    let keyB = new Date(b._source.year);
    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  data.forEach((item) => {
    title.push([item._source.title, item._source.year])
  })

  return (
    <p>{JSON.stringify(title)}</p>
  )
}