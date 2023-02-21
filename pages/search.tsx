import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Layout from '../components/layout'
import styles from '../styles/Search.module.css'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import kmeans from "node-kmeans"
// import kmeans from 'kmeansjs'


const fetcher = (url: string, key: string) => fetch(`${url}?key=${key}`).then((res) => res.json())
// const fetcher = (url: string, key: string) => fetch(url, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(key)}).then((res) => res.json())
const fetcherPapers = (url: string, paperIds) => 
  fetch(url, {
    method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(paperIds)
  }).then((res) => res.json())


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
          <p className={`color-tree ${styles.title}`}>Papers2D</p>
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

export function SearchPapers({paperIds}) {
  
  const router = useRouter()
  const {data, error} = useSWR(['/api/es_mget', router.query.key], fetcherPapers)

  if (error) return <div>Failed to load, {error}</div>;
  if (!data) return <div>Loading...</div>;
  
  console.log("result data from mget: ", data)
  
}

function SearchResults({data}) {

  const [selectedPaper, setSelectedPaper] = useState(null)
  const [refsCitations, setRefsCitations] = useState()

  // data.sort((a, b) => b._source.year - a._source.year)
  if (data == null || data.length == 0) {
    return (
      <p>0 results in our database. Please try other keywords</p>
    )
  }

  const papersMap = Object.assign(
    {}, ...data.map(item => ({
      [item._id]: item._source}))
  )

  const loadRefsCitations = (e, paperId) => {
    e.preventDefault()
    const paperRefs = papersMap[paperId].refs
    // const paperCitations = papersMap[paperId].citedby
    
    setRefsCitations(paperRefs)
    
    // console.log(paperId, papersMap[paperId].refs)
    // console.log(paperId, papersMap[paperId].citedby)
    // const {data, error} = useSWR(['/api/es_search', router.query.key], fetcher)
  }

  return (
    <div className='row'>
      <div className='col-12 col-md-9 max-vh-91 overflow-auto'>
        <DisplayPapers papers={data} papersMap={papersMap} refsCitations={refsCitations} setSelectedPaper={setSelectedPaper} />
      </div>
      <div className='col-12 col-md-3 max-vh-91 overflow-auto'>
        <DisplayPaperDetails paper={selectedPaper} loadRefsCitations={loadRefsCitations}/>
      </div>
    </div>
  )
}


function PaperGroups({ papers, handleSelection }) {

  // const [paperClusters, setPaperClusters] = useState([])
  // useEffect(() => {
  //   const clusterPapers = async () => {
  //     const embeddings = papers.map(item => item._source.embedding)
  //     kmeans.clusterize(embeddings, {k: 3, seed: 1222}, (err, res) => {
  //       if (err) console.error(err)
  //       if (res) {
  //         setPaperClusters(res)
  //       }
  //     })
  //   }
  //   // console.log("call use effect", papers)
  //   // if (papers.length > 5) clusterPapers()
  // }, [papers.length])

  // console.log("papers", papers)

  // if (paperClusters.length == 0) {
  papers.sort((a, b) => b._source.citations - a._source.citations)

  return (
    papers.map((paper, idx) =>
      <div className="col" key={idx}>
        <div 
          className={styles.paperItem} 
          onClick={event => handleSelection(event, paper._id)}
        >
          <i className="bi bi-caret-right-fill color-tree"></i> 
          &nbsp; 
          {paper._source.title} <small>({paper._source.citations} citations)</small>
        </div>
      </div>
    )
  )
  // } 
  
  // The following code that use the K-means result never runs

  // paperClusters.sort((a, b) => b.clusterInd.length - a.clusterInd.length)
  
  // const x = paperClusters.map((oneCluster, clusterIdx) => {

  //   const papersInOneCluster = oneCluster.clusterInd.map(idx => papers[idx])
  //   papersInOneCluster.sort((a, b) => b._source.citations - a._source.citations)

  //   return (
  //     <div className="col" key={clusterIdx}>
  //       <small>Group #{clusterIdx}</small>
  //       {papersInOneCluster.map((paper, paperIdx) => {
  //         let item_style = null
  //         if (paperIdx % 2 == 0) {
  //           item_style = styles.paperItemRef
  //         }
  //         return (
  //           <div 
  //             className={`${styles.paperItem} ${item_style}`}
  //             onClick={event => handleSelection(event, paper._id)}
  //             key={paperIdx}
  //           >
  //             {/* <i className="bi bi-arrow-right-short"></i>  */}
  //             <i className="bi bi-caret-right-fill color-tree"></i> 
  //             &nbsp; 
  //             {paper._source.title} <small>({paper._source.citations} citations)</small>
  //           </div>
  //         )
  //       }
  //       )}
  //     </div>
  //   )
  // })
  
}

function DisplayPapers({ papers, papersMap, refsCitations, setSelectedPaper }) {
  
  const handleSelection = (e, paperId) => {
    e.preventDefault()
    // console.log(paperId, papersMap[paperId])
    setSelectedPaper(papersMap[paperId])
  }

  console.log(refsCitations)

  let groupedPapers = papers.reduce((r, a) => {
    r[a._source.year] = r[a._source.year] || []
    r[a._source.year].push(a)
    return r
  }, Object.create(null))
  groupedPapers = Object.entries(groupedPapers).reverse()

  const listItems = groupedPapers.map((item: any) => {
    return <li key={item[0]} className="list-group-item">
      <small>{item[0]}</small>
      <div className="row row-cols-3">
        <PaperGroups papers={item[1]} handleSelection={handleSelection}/>
      </div>
    </li>
  })

  return (
    <ul className="list-group list-group-flush">
      {listItems}
    </ul>
  )
}

function DisplayPaperDetails({ paper, loadRefsCitations }) {
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
  const googleUrl = "https://www.google.com/search?q=\"" + paper.title + "\""
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
      <div className="row justify-content-between">
        <div className="col col-auto">
          <strong>Links: </strong> 
          <a href={paper.url_pdf} target="_blank" rel="noreferrer">
            <i className={`bi bi-filetype-pdf ${styles.linkIcon}`}></i>
          </a>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            <i className={`bi bi-github ${styles.linkIcon}`}></i>
          </a>
          <a href={googleScholarUrl} target="_blank" rel="noreferrer">
            <svg className={`${styles.linkIcon} ${styles.linkIconGoogleScholar}`} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1.8rem" height="1.8rem" viewBox="0 0 24 24">
              <g fill="#46616d">
                <path d="M 11 4 L 3 9 L 8.4921875 9 C 8.4715892 9.0754986 8.4383718 9.1441171 8.421875 9.2226562 C 8.375875 9.4646562 8.3398437 9.7308125 8.3398438 10.007812 C 8.3398438 13.578812 11.990234 13.175781 11.990234 13.175781 L 11.990234 14.085938 C 11.990234 14.454937 12.47425 14.327172 12.53125 15.076172 C 12.28925 15.076172 7.4746094 14.937547 7.4746094 18.185547 C 7.4746094 21.445547 11.724609 21.285156 11.724609 21.285156 C 11.724609 21.285156 16.632812 21.504656 16.632812 17.472656 C 16.634813 15.063656 13.822266 14.2795 13.822266 13.3125 C 13.822266 12.3335 15.941406 12.045906 15.941406 9.7539062 C 15.941406 8.7519062 15.872828 8.03825 15.423828 7.53125 C 15.388828 7.49625 15.366031 7.4722188 15.332031 7.4492188 C 15.324304 7.4420199 15.31448 7.4367774 15.306641 7.4296875 L 15.429688 7.4296875 L 17.5 5.8769531 L 17.5 8 A 0.50005 0.50005 0 0 0 17.511719 8.1152344 A 1.0001 1.0001 0 0 0 17 9 L 17 10 A 1.0001 1.0001 0 1 0 19 10 L 19 9 A 1.0001 1.0001 0 0 0 18.488281 8.1152344 A 0.50005 0.50005 0 0 0 18.5 8 L 18.5 5.125 L 20 4 L 11 4 z M 11.691406 7.0527344 C 11.979219 7.0397031 12.268922 7.109625 12.544922 7.265625 C 12.751922 7.369625 12.946141 7.518125 13.119141 7.703125 C 13.476141 8.060125 13.7765 8.5784531 13.9375 9.1894531 C 14.3175 10.640453 13.823828 12.035781 12.798828 12.300781 C 11.784828 12.587781 10.654672 11.641172 10.263672 10.201172 C 10.090672 9.4991719 10.114547 8.8202969 10.310547 8.2792969 C 10.312395 8.2723193 10.316443 8.2666961 10.318359 8.2597656 C 10.321722 8.2581149 10.32682 8.253536 10.330078 8.2519531 C 10.386262 8.0380596 10.478099 7.8461668 10.589844 7.6875 C 10.795388 7.3872165 11.066477 7.1838352 11.404297 7.09375 C 11.499297 7.07075 11.595469 7.0570781 11.691406 7.0527344 z M 12.082031 15.685547 C 13.775031 15.558547 15.216313 16.490813 15.320312 17.757812 C 15.390313 19.013813 14.087812 20.131094 12.382812 20.246094 C 10.689813 20.361094 9.2274844 19.441547 9.1464844 18.185547 C 9.0654844 16.918547 10.377031 15.812547 12.082031 15.685547 z"></path>
              </g>
            </svg>
          </a>
          <a href={googleUrl} target="_blank" rel="noreferrer">
            <i className={`bi bi-google ${styles.linkIcon}`}></i>
          </a>
        </div>
        <div className="col col-auto">
          <button type="button" className={`btn ${styles.btnLoad}`} onClick={event => loadRefsCitations(event, paper.id)}>
            Load Refs & Citations
          </button>
        </div>
      </div>
      <div>
        <strong>Abstract: </strong> {paper.abstract}
      </div>
    </div>
  )
}
