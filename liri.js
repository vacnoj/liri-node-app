var twitter = require('twitter');

var twitterKeys = require('./keys.js');

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
		} else console.log("Access Denied");

		if (inquirerResponse.action === 'my-tweets') {
			request("http://api.twitter.com/1/statuses/update.json", function(error, response, body) {
				console.log('error:', error);
  
  				console.log('statusCode:', response && response.statusCode); 
  
  				console.log('body:', body); 

			});
		}
	});