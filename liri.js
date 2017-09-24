var twitterKeys = require('./keys.js');

var Twitter = require('twitter');
 

// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says

var inquirer = require('inquirer');

var request = require('request');
const password = "1";

inquirer.prompt([

{
	type: "password",
	message: "waht is your password?",
	name: "password",
	mask: "ha"
},
{
	type: "input",
      message: "What do you want to do?",
      name: "action"
}
])

.then(function (inquirerResponse) {
		if(inquirerResponse.password == password) {
			console.log(`Welcome, Jon!`);

			if (inquirerResponse.action === 'my-tweets') {
			var client = new Twitter({
				consumer_key: twitterKeys.consumer_key,
				consumer_secret: twitterKeys.consumer_secret,
				access_token_key: twitterKeys.access_token_key,
				access_token_secret: twitterKeys.access_token_secret
			});

			var params = {screen_name: 'vacnoj'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
debugger;
				if (!error) {
					for (var i = 0; i < tweets.length && i < 20; i++) {
						console.log(`created: ${tweets[i].created_at}`);
						console.log(`tweet: ${tweets[i].text}`);
					}
			  	} else console.log("error: ", error);
			});			
			}
		} else console.log("Access Denied");


	});