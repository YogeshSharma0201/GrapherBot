var fetchAction =  require('fetch');

var url = "https://data.bacteriology62.hasura-app.io/v1/query";

// If you have the auth token saved in offline storage
// var authToken = window.localStorage.getItem('HASURA_AUTH_TOKEN');
// headers = { "Authorization" : "Bearer " + authToken }
let requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DATABASE_AUTHORIZATION}`,
        "X-Hasura-Role": "admin"
    }
};

var body = {
    "type": "insert",
    "args": {
        "table": "User",
        "objects": [
            {
                "name": "Yog",
                "id": "123",
                "channel_name": "344",
                "channel_id": "3434",
                "webhook_url": "3444"
            }
        ],
        "on_conflict": {
            "action": "ignore"
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