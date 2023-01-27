import {index_name, connectToES} from "../../libs/es_database"


export default async function info(req, res) {
    try {
        const client = connectToES()
        const { body } = await client.info()
        res.status(200).json(body)

    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message})
    }
}
