# papers2d-web

Website: [https://papers2d.com](https://papers2d.com)

1. Check branch to the `dev` branch.
2. Create local environment file `.env`. Put 
```
ES_LINODE_ADDR=https://ip:port
ES_LINODE_USERNAME=elastic
ES_LINODE_PASSWORD=password
ES_LINODE_HTTP_CA_CERT=base64 format
```
And also update the environment on the vercel.com.

3. Run `yarn dev` for development.
4. Run `yarn build` to compile the code and check the potential errors for deployment.
5. Use git push to push the local changes to remote server.