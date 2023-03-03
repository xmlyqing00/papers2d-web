import {index_name, connectToES} from "../../libs/es_database"


export default async function mget(req, res) {
    try {
        const client = connectToES()
        const results = await client.mget({      
            index: index_name,      
            body: {
                ids: req.body,
            }
        })
        console.log(results.body)
        res.status(200).json(results.body)

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message})
    }
}