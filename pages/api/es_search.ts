import React from 'react'
import { Client } from '@elastic/elasticsearch'
import { NextApiRequest, NextApiResponse } from "next"


let index_name: string = 'papers'

async function connectToES() {
    const ESS_CLOUD_ID = process.env.ESS_CLOUD_ID
    const ESS_CLOUD_USERNAME = process.env.ESS_CLOUD_USERNAME
    const ESS_CLOUD_PASSWORD = process.env.ESS_CLOUD_PASSWORD

    if (!ESS_CLOUD_ID || !ESS_CLOUD_USERNAME || !ESS_CLOUD_PASSWORD)
    {
        return "ERR_ENV_NOT_DEFINED"
    }

    return new Client({
        cloud: {
            id: ESS_CLOUD_ID,
        },
        auth: {
            username: ESS_CLOUD_USERNAME,
            password: ESS_CLOUD_PASSWORD,
        }
    })
}

async function connectToESLocal() {
    return new Client({
        node: 'http://localhost:9200'
    })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await connectToES()
        // const { body } = await client.info()
        // res.status(200).json(body)
        const { body } = await client.search({
            'index': index_name,
            body: {
                query: {
                    match: {
                        title: req.query.key
                    }
                },
                size: 10,
                min_score: 1
            }
        })
        res.status(200).json(body.hits.hits)


        // res.status(200).json({method: (req.query)})

        // hits2 = body.hits.hits
        // results = []
        // hits2.forEach((item) => {
        //     results.push(item._source)
        // })
        // results.push(req.body)
        // res.status(200).json(results)
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message})
    }
}
