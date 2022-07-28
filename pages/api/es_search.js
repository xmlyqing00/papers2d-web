import { Client } from '@elastic/elasticsearch'

const index_name = 'papers'
const es_server = 'es_linode'


async function connectToES() {
    if (es_server == "es_local") {

        return new Client({
            node: 'http://localhost:9200'
        })

    } else if (es_server == "es_cloud") {

        const ES_CLOUD_ID = process.env.ES_CLOUD_ID
        const ES_CLOUD_USERNAME = process.env.ES_CLOUD_USERNAME
        const ES_CLOUD_PASSWORD = process.env.ES_CLOUD_PASSWORD

        return new Client({
            cloud: {
                id: ES_CLOUD_ID,
            },
            auth: {
                username: ES_CLOUD_USERNAME,
                password: ES_CLOUD_PASSWORD,
            }
        })

    } else {

        let ES_ADDR
        let ES_USERNAME
        let ES_PASSWORD

        if (es_server == "es_server") {
            ES_ADDR = process.env.ES_AWS_ADDR
            ES_USERNAME = process.env.ES_AWS_USERNAME
            ES_PASSWORD = process.env.ES_AWS_PASSWORD
        } else if (es_server == "es_linode") {
            ES_ADDR = process.env.ES_LINODE_ADDR
            ES_USERNAME = process.env.ES_LINODE_USERNAME
            ES_PASSWORD = process.env.ES_LINODE_PASSWORD
        }

        const fs = require('fs');

        return new Client({
            node: ES_ADDR,
            auth: {
                username: ES_USERNAME,
                password: ES_PASSWORD
            },
            ssl: {
                ca: fs.readFileSync('./http_ca.cert'),
            }
        })    
    }
}


export default async (req, res) => {
    try {
        const client = await connectToES()
        // const { body } = await client.info()
        // console.log(body)
        const results = await client.search({
            index: index_name,
            body: {
                query: {
                    match: {
                        title: req.query.key
                    }
                },
                size: 10,
            }
        })

        res.status(200).json(results.body.hits.hits)

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message})
    }
}
