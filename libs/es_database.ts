import { Client } from '@elastic/elasticsearch'


const index_name: string = "papers"
const es_server: string = 'es_linode'


function connectToES() {
    
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

        let es_addr
        let es_username
        let es_password
        let es_http_ca_cert

        if (es_server == "es_server") {
            es_addr = process.env.ES_AWS_ADDR
            es_username = process.env.ES_AWS_USERNAME
            es_password = process.env.ES_AWS_PASSWORD
        } else if (es_server == "es_linode") {
            es_addr = process.env.ES_LINODE_ADDR
            es_username = process.env.ES_LINODE_USERNAME
            es_password = process.env.ES_LINODE_PASSWORD
            es_http_ca_cert = process.env.ES_LINODE_HTTP_CA_CERT
        }

        return new Client({
            node: es_addr,
            auth: {
                username: es_username,
                password: es_password
            },
            ssl: {
                ca: Buffer.from(es_http_ca_cert, 'base64').toString('ascii'),
                rejectUnauthorized: true
            }
        })    
    }
}

export {index_name, connectToES}
