import {index_name, connectToES} from "../../libs/es_database"


export default async function mget(req, res) {

    try {
        const client = connectToES()
        // const { body } = await client.info()
        // console.log(body)
        const results = await client.mget({

        })
            // index: index_name,
        //     body: {
        //         query: {
        //             bool: {
        //                 must: {
        //                     multi_match: {
        //                         query: req.query.key,
        //                         fields: ["title^1.5", "abstract"],
        //                         type: 'best_fields',
        //                         tie_breaker: 0.3
        //                     }
        //                 },
        //                 filter: {
        //                     term: {
        //                         source: 'official'
        //                     }
        //                 }
        //             }
                    
        //         },
        //         size: 100,
        //         min_score: 3
        //     }
        // })

        res.status(200).json(results.body.hits.hits)

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message})
    }
}