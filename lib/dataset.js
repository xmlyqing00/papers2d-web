import { Client } from '@elastic/elasticsearch'
// import dotenv from 'dotenv'


export async function connectToES() {
    // //process.env is not available from this folder, since this is outside of the project
    // //for this reason dotenv is used to resolve .env file
    // const result = dotenv.config()
    // if (
    //   !result.parsed.ESS_CLOUD_ID ||
    //   !result.parsed.ESS_CLOUD_USERNAME ||
    //   !result.parsed.ESS_CLOUD_PASSWORD
    // ) {
    //   return 'ERR_ENV_NOT_DEFINED'
    // }
    // return new Client({
    //   cloud: {
    //     id: result.parsed.ESS_CLOUD_ID,
    //   },
    //   auth: {
    //     username: result.parsed.ESS_CLOUD_USERNAME,
    //     password: result.parsed.ESS_CLOUD_PASSWORD,
    //   },
    // })
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

export async function connectToESLocal() {
    return new Client({
        node: 'http://localhost:9200'
    })
}