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

let paperIds = ['Islam_Gated_Feedback_Refinement_CVPR_2017_paper', '7ggf9YUBPY7D5Y0yq-Lv', 'ZggA9YUBPY7D5Y0yvkoE', 'Rwge9YUBPY7D5Y0y6t6N', '7wgU9YUBPY7D5Y0yubNP', 'BAgA9YUBPY7D5Y0yWkhJ', 'PAgH9YUBPY7D5Y0yOG2H', 'fggV9YUBPY7D5Y0yJrZT', 'oggO9YUBPY7D5Y0yKJI6', 'Cordts_The_Cityscapes_Dataset_CVPR_2016_paper', 'hAgU9YUBPY7D5Y0y0rSg', 'rwfz9IUBPY7D5Y0ybOqC', 'vggN9YUBPY7D5Y0y1ZDS', 'mwgZ9YUBPY7D5Y0y18wj', 'HQf19IUBPY7D5Y0yZvyo', 'xwgc9YUBPY7D5Y0yqdbU', 'Fu_Dual_Attention_Network_for_Scene_Segmentation_CVPR_2019_paper', 'cAgQ9YUBPY7D5Y0yUZ6f', 'eQlE9YUBPY7D5Y0yhUk0', 'He_Adaptive_Pyramid_Context_Network_for_Semantic_Segmentation_CVPR_2019_paper', '5wgS9YUBPY7D5Y0yzaon', '0wgN9YUBPY7D5Y0yYY0O', 'lgk-9YUBPY7D5Y0yIDpY', 'Iwj_9IUBPY7D5Y0yvUQN', '0wgO9YUBPY7D5Y0yMJJy', 'jAj89IUBPY7D5Y0yei_6', 'dAj59IUBPY7D5Y0yGhew', '7AgH9YUBPY7D5Y0yU22U', 'ewj59IUBPY7D5Y0ypRv3', 'Mottaghi_The_Role_of_2014_CVPR_paper', 'oAj69IUBPY7D5Y0yViBk', 'cgj49IUBPY7D5Y0y9xbp', 'Pohlen_Full-Resolution_Residual_Networks_CVPR_2017_paper', 'RggF9YUBPY7D5Y0yUGRT', '5gk89YUBPY7D5Y0yazYV', 'OAj69IUBPY7D5Y0yRSDn', 'DQgD9YUBPY7D5Y0yQ1l_', 'TAgV9YUBPY7D5Y0y3Lp9', 'Wang_Non-Local_Neural_Networks_CVPR_2018_paper', '-AgW9YUBPY7D5Y0yj72c', 'Yu_Context_Prior_for_Scene_Segmentation_CVPR_2020_paper', 'owj89IUBPY7D5Y0yUi5l', 'Igge9YUBPY7D5Y0yZ9zG', 'NggF9YUBPY7D5Y0y52et', 'Zhang_Co-Occurrent_Features_in_Semantic_Segmentation_CVPR_2019_paper', 'Zhao_Pyramid_Scene_Parsing_CVPR_2017_paper', 'iAgJ9YUBPY7D5Y0yT3kd', 'qwgI9YUBPY7D5Y0yoXU6', 'bggO9YUBPY7D5Y0yHJLJ']

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

  if (error) return <div>Failed to load, {error}</div>;
  if (!data) return <div>Loading...</div>;
  
  console.log("result data from mget: ", data)
  
  if (error) return <div>Failed to load, {error}</div>
  if (!data) return (
    <div>Loading...</div>
  )

  console.log(JSON.stringify(data))

  return (
    <Layout>{JSON.stringify(data)}</Layout>
  )
}