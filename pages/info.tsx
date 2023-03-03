import React from 'react'
import Layout from '../components/layout'
import useSWR from 'swr'
import { useRouter } from 'next/router'


// const fetcher = (url: string, key: string) => fetch(`${url}?key=${key}`).then((res) => res.json())
const fetcherPapers = (url: string, paperIds) => 
  fetch(url, {
    method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(paperIds)
  }).then((res) => res.json())

const paperIds = ['Islam_Gated_Feedback_Refinement_CVPR_2017_paper', '7ggf9YUBPY7D5Y0yq-Lv', 'ZggA9YUBPY7D5Y0yvkoE']

// export function SearchPapers({paperIds}) {
  
//   const router = useRouter()
//   const {data, error} = useSWR(['/api/es_mget', router.query.key], fetcherPapers)

//   if (error) return <div>Failed to load, {error}</div>;
//   if (!data) return <div>Loading...</div>;
  
//   console.log("result data from mget: ", data)
  
// }

export default function Info() {
  const router = useRouter()
  // const {data, error} = useSWR('/api/es_info', fetcher)
  
  const {data, error} = useSWR(['/api/es_mget', paperIds], fetcherPapers)

  // const handleSearchPapers = async (event) => {
  //     event.preventDefault()
  //     router.push({
  //       pathname: '/info',
  //       // query: {key: event.target.query.value}
  //     })
  //   }
  console.log("paperid type: ", typeof paperIds)
  
  if (error) return <div>Failed to load, {error}</div>
  if (!data) return (
    <div>Loading...</div>
  )

  return (
    
    <Layout>
      {/* <button type="button" onClick={handleSearchPapers}>
        test
      </button> */}
      {JSON.stringify(data)}
    </Layout>
  )
}