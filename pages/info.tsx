import React from 'react'
import Layout from '../components/layout'
import useSWR from 'swr'


const fetcher = (url: string, key: string) => fetch(`${url}?key=${key}`).then((res) => res.json())

export default function Info() {
  const {data, error} = useSWR('/api/es_info', fetcher)
  
  if (error) return <div>Failed to load, {error}</div>
  if (!data) return (
    <div>Loading...</div>
  )

  console.log(JSON.stringify(data))

  return (
    <Layout>{JSON.stringify(data)}</Layout>
  )
}