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
  if (!data) return (
    <div>Loading...</div>
  )
  
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
      <div className={`col-auto ${styles.titlePanel}`}>
        <Link href="/" passHref>
          <p className={`title-color ${styles.title}`}>Papers2D</p>
        </Link> 
      </div>
      <div className="col-5 col-md-4 col-xl-3">
        <form onSubmit={handleSearch}>
          <input className={`form-control `}
            onChange={handleChange}
            type="text"               
            placeholder="try: segmentation"
            value={queryStr}
          />
        </form>
      </div>
      
      <div className="col-auto">
          <i className={`bi bi-search ${styles.searchIcon}`} onClick={handleSearch}></i>
        </div>
    </div>
  )
}

function DisplayPapers({papers}) {

  let groupedPapers = papers.reduce((r, a) => {
    r[a._source.year] = r[a._source.year] || []
    r[a._source.year].push(a)
    return r
  }, Object.create(null))
  groupedPapers = Object.entries(groupedPapers).reverse()

  console.log(groupedPapers)

  const listItems = groupedPapers.map((item: any) => 
    <li key={item[0]} className="list-group-item">
      <small>{item[0]}</small>
      {item[1].map((paper) =>
        <div key={paper._id}>{paper._source.title} ({paper._source.citations})</div>
      )}
    </li>
  )

  return (
    <ul className={`list-group list-group-flush ${styles.listGroupHover}`}>
      {listItems}
    </ul>
  )
}

function DisplayPaperDetails({paper}) {
  return (
    <div>
      <p>Title: </p>
      <p>Author: </p>
      <p>Published at:</p>
      <p>Year: </p>
    </div>
  )
}

function SearchResults({data}) {

  const [selectedPaper, setselectedPaper] = useState(null)

  console.log(data)
  data.sort((a, b) => b._source.year - a._source.year)

  let title = []
  
  data.forEach((item) => {
    title.push([item._source.title, item._source.year, item._source.citations])
  })

  return (
    <div className='row'>
      <div className='col-12 col-md-9'>
        <DisplayPapers papers={data} />
      </div>
      <div className='col-12 col-md-3'>
        <DisplayPaperDetails paper={selectedPaper}/>
      </div>
    </div>
  )
}