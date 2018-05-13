# GrapherBot

## How to get started
### Development
1) `$ cd /microservices/api/src`
2) `$ cp sample.env .env`
3)  Fill out the environment variables in .env file. You can get these variables from 
    after creating a new app.
4)  After creating the app enable incoming-webhook, also add a command `/gb` 
    and give its link `domain.com/gb`. 
5)  `$ npm install`
6)  Install ngrok so as to tunnel localhost:8080 to https.
7)  Run `$ npm start` to start the api on localhost:8080 
    and tunnel it through ngrok by `./ngrok http 8080`
8)  Use this tunnel link to set O-auth redirect link for 
    slack app, this redirect link would be something like `https://7a09f0eb.ngrok.io/auth/slack/callback`
 

## Files and Directories

The project (a.k.a. project directory) has a particular directory structure and it has to be maintained strictly, else `hasura` cli would not work as expected. A representative project is shown below:

```
.
├── hasura.yaml
├── clusters.yaml
├── conf
│   ├── authorized-keys.yaml
│   ├── auth.yaml
│   ├── ci.yaml
│   ├── domains.yaml
│   ├── filestore.yaml
│   ├── gateway.yaml
│   ├── http-directives.conf
│   ├── notify.yaml
│   ├── postgres.yaml
│   ├── routes.yaml
│   └── session-store.yaml
├── migrations
│   ├── 1504788327_create_table_userprofile.down.yaml
│   ├── 1504788327_create_table_userprofile.down.sql
│   ├── 1504788327_create_table_userprofile.up.yaml
│   └── 1504788327_create_table_userprofile.up.sql
└── microservices 
    ├── adminer
    │   └── k8s.yaml
    └── flask
        ├── src/
        ├── k8s.yaml
        └── Dockerfile
```

### `hasura.yaml`

This file contains some metadata about the project, namely a name, description and some keywords. Also contains `platformVersion` which says which Hasura platform version is compatible with this project.

### `clusters.yaml`

Info about the clusters added to this project can be found in this file. Each cluster is defined by it's name allotted by Hasura. While adding the cluster to the project you are prompted to give an alias, which is just hasura by default. The `kubeContext` mentions the name of kubernetes context used to access the cluster, which is also managed by hasura. The `config` key denotes the location of cluster's metadata on the cluster itself. This information is parsed and cluster's metadata is appended while conf is rendered. `data` key is for holding custom variables that you can define.

```yaml
- name: h34-ambitious93-stg
  alias: hasura
  kubeContext: h34-ambitious93-stg
  config:
    configmap: controller-conf
    namespace: hasura
  data: null  
```
