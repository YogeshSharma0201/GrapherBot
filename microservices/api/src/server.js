var express = require('express');
var app = express();
var request = require('request');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var passport = require('passport');
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;
var fetchAction =  require('node-fetch');
const { IncomingWebhook } = require('@slack/client');
var https = require("https");

require('dotenv').config();

require('request-debug')(request);

var hasuraExamplesRouter = require('./hasuraExamples');

var server = require('https').Server(app);

const url = "https://data.bacteriology62.hasura-app.io/v1/query";


let requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DATABASE_AUTHORIZATION}`,
        "X-Hasura-Role": "admin"
    }
};

//keep hasura cluster awake
setInterval(function() {
    https.get("https://api.bacteriology62.hasura-app.io/");
}, 180000);

router.use(morgan('dev'));


app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	helpers: {
	    toJSON : function(object) {
	      return JSON.stringify(object, null, 4);
	    }
  	}
	})
);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
}, function(accessToken, scopes, team, botandIncomingWh, UserandTeamProfile, done)  {
    // Create your desired user model and then call `done()`
    console.log("hello");
}));


app.get('/auth/slack', passport.authenticate('slack'));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
}, (accessToken, scopes, team, { bot, incomingWebhook }, { user: userProfile , team: teamProfile }, done) => {

    console.log(incomingWebhook, userProfile, teamProfile, team, scopes, accessToken);

    var find = {
        "type": "select",
        "args": {
            "table": "User",
            "columns": [
                "*"
            ],
            "where": {
                "id": {
                    "$eq": `${userProfile.id}`
                }
            }
        }
    };

    var insert = {
        "type": "insert",
        "args": {
            "table": "User",
            "objects": [
                {
                    "name": `${userProfile.name}`,
                    "id": `${userProfile.id}`,
                    "channel_name": `${incomingWebhook.channel.name}`,
                    "channel_id": `${incomingWebhook.channel.id}`,
                    "webhook_url": `${incomingWebhook.url}`
                }
            ],
            "on_conflict": {
                "action": "ignore"
            }
        }
    };

    requestOptions.body = JSON.stringify(find);

    fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            if(result.length == 0) {

                console.log(insert);

                requestOptions.body = JSON.stringify(insert);

                return fetchAction(url, requestOptions)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(result) {
                            console.log(result);
                            done(null, insert.args.objects[0]);
                        })
                        .catch(function(error) {
                            console.log('Request Failed:' + error);
                            done(error);
                        });
            }

            done(null, result[0]);
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
            done(error);
        });

}));

// let redirectURL = `https://slack.com/oauth/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=incoming-webhook`;

app.get('/auth/slack/callback', passport.authenticate('slack', {failureRedirect: '/auth/slack' }),
    function(req, res) {
        console.log(req.user);
        const url = req.user.webhook_url;
        const webhook = new IncomingWebhook(url);

        webhook.send(`Hello ${req.user.channel_name}!`, function(err, res) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Message sent: ', res);
            }
        });
        res.render("login_success");
});

app.post('/gb', function(req, res) {
        res.status(200).send("Pong");
});

app.use('/', hasuraExamplesRouter);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
