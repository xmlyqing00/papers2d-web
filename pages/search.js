import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/layout'
import styles from '../styles/Search.module.css'
import useSWR from 'swr'


const fetcher = (url, key) => fetch(`${url}?key=${key}`).then((res) => res.json())


export default function Search() {

  const router = useRouter()
  const [queryStr, setQueryStr] = useState('')
  const handleSearch = async (event) => {
    if (queryStr.length > 0) {
      event.preventDefault()
      router.push({
        pathname: '/search',
        // query: {key: event.target.query.value}
        query: {key: queryStr}
      })
    }
  }
  const {data, error} = useSWR(['/api/es_search', router.query.key], fetcher)
  
  if (error) return <div>Failed to load, {error}</div>
  if (!data) return <div>Loading...</div>

  let title = []
  
  data.forEach((item) => {
      title.push(item._source.title)
  })
  
  return (
    <Layout>
      <div className="row">
        <div className="col-1">
          Knowledge Shelf
        </div>
        <form className="col-3" onSubmit={handleSearch}>
          <input 
            onChange={(e) => setQueryStr(e.target.value)}
            type="text"               
            placeholder="Example:  Object Tracking" 
          />
        </form>
      </div>
      <p>{JSON.stringify(title)}</p>
    </Layout>
  )
}