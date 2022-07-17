import {connectToES, connectToESLocal} from '../../lib/dataset'


export default async function handler(req, res) {
    try {
        const client = await connectToESLocal()
        // const { body } = await client.info()
        // res.status(200).json({body})
        const {body} = await client.search({
            'index': 'papers',
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
