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


function SearchResults({data}) {

  const [selectedPaper, setSelectedPaper] = useState(null)

  // console.log(data)
  // data.sort((a, b) => b._source.year - a._source.year)
  if (data.length == 0) {
    return (
      <p>0 results in our database. Please try other keywords</p>
    )
  }


  return (
    <div className='row'>
      <div className='col-12 col-md-9 max-vh-92 overflow-auto'>
        <DisplayPapers papers={data} setSelectedPaper={setSelectedPaper} />
      </div>
      <div className='col-12 col-md-3 max-vh-92 overflow-auto'>
        <DisplayPaperDetails paper={selectedPaper}/>
      </div>
    </div>
  )
}


function DisplayPapers({papers, setSelectedPaper}) {

  const papersMap = Object.assign(
    {}, ...papers.map(item => ({
      [item._id]: item._source}))
  )
  
  const handleSelection = (e, paperId) => {
    console.log(paperId, papersMap[paperId])
    setSelectedPaper(papersMap[paperId])
  }

  let groupedPapers = papers.reduce((r, a) => {
    r[a._source.year] = r[a._source.year] || []
    r[a._source.year].push(a)
    return r
  }, Object.create(null))
  groupedPapers = Object.entries(groupedPapers).reverse()

  const listItems = groupedPapers.map((item: any) => 
    <li key={item[0]} className="list-group-item">
      <small>{item[0]}</small>
      {item[1].map((paper) =>
        <div key={paper._id} onClick={event => handleSelection(event, paper._id)}>
          {paper._source.title} ({paper._source.citations})
        </div>
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
  if (paper == null) {
    return (
      <p>Please click one paper.</p>
    )
  }

  const authorsText = paper.authors.join(', ')
  let year = paper.year
  if (year == null) {
    year = paper.published_date_str
  }

  const googleScholarUrl = "https://scholar.google.com/scholar?q=\"" + paper.title + "\""
  const githubUrl = "https://github.com/search?q=\"" + paper.title + "\""

  return (
    <div>
      <div>
        <h4>{paper.title}</h4>
      </div>
      <div>
        <strong>Authors: </strong> {authorsText}
      </div>
      <div>
        <strong>Publisher: </strong> {paper.org} ({year})
      </div>
      <div>
        <strong>Citations: </strong> {paper.citations}
      </div>
      <div>
        <strong>Links: </strong> 
        <a href={paper.url_pdf} target="_blank" rel="noreferrer">
          <i className={`bi bi-filetype-pdf ${styles.linkIcon}`}></i>
        </a>
        <a href={googleScholarUrl} target="_blank" rel="noreferrer">
          <i className={`bi bi-google ${styles.linkIcon}`}></i>
        </a>
        <a href={githubUrl} target="_blank" rel="noreferrer">
          <i className={`bi bi-github ${styles.linkIcon}`}></i>
        </a>
      </div>
      <div>
        <strong>Abstract: </strong> {paper.abstract}
      </div>
    </div>
  )
}
