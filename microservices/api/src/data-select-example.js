var fetchAction =  require('fetch');

var url = "https://data.bacteriology62.hasura-app.io/v1/query";

let requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DATABASE_AUTHORIZATION}`,
        "X-Hasura-Role": "admin"
    }
};

var body = {
    "type": "select",
    "args": {
        "table": "User",
        "columns": [
            "*"
        ],
        "where": {
            "name": {
                "$eq": "Yog"
            }
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        console.log(result);
    })
    .catch(function(error) {
        console.log('Request Failed:' + error);
    });