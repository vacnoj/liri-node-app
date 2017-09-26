var keys = require('./keys.js');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api'); 

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
	type: "list",
	choices: ["my-tweets", "spotify", "movie IMDB", "do what it says"],
    message: "What do you want to do?",
    name: "action"
}
])

.then(function (inquirerResponse) {
	if(inquirerResponse.password == password) {
		console.log(`Welcome, Jon!`);

		if (inquirerResponse.action === 'my-tweets') {
		inquirer.prompt([
			{
				type: 'input',
				message: 'What is your username for Twitter?',
				name: 'twitterUserName'
			}
		])
		.then(function(username) {
			var client = new Twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret
		});

		var params = {screen_name: username.name};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {

			if (!error) {
				for (var i = 0; i < tweets.length && i < 20; i++) {
					console.log(`created: ${tweets[i].created_at}`);
					console.log(`tweet: ${tweets[i].text}`);
				}
			} else console.log("error: ", error);
		});
		});
				
		} else if (inquirerResponse.action === 'spotify') {
			inquirer.prompt([
				{
				type: "input",
				message: "What song?",
				name: 'song'
				}
			])
			.then(function(song) {

			var spotify = new Spotify({
				id: keys.spotifyKeys.id,
				secret: keys.spotifyKeys.secret
			});

			spotify.search({ type: 'track', query: song.song }, function(error, data) {
				if (!error) {

					for (var i = 0; i < data.tracks.items.length; i++) {
						console.log('____________________________________________________________');
						console.log(`\nTitle: ${data.tracks.items[i].name}`);
						console.log(`Album: ${data.tracks.items[i].album.name}`);
						for (var k = 0; k < data.tracks.items[i].artists.length; k++) {
						console.log(`Artist ${k + 1}: ${data.tracks.items[i].artists[k].name}`);
						}
						console.log(`Link:  ${data.tracks.items[i].external_urls.spotify}`);
						console.log('____________________________________________________________');
					}
				} else console.log('error: ', error);
			});
		});
		} else if(inquirerResponse.action === "movie IMDB") {
			inquirer.prompt([
				{
					tpye: 'input',
					message: 'What movie?',
					name: 'movie'
				}
			])
			.then(function(movie) {
				var title = movie.movie;
				var queryURL = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";
				request(queryURL, function (error, response, body) {
					if(!error && response.statusCode === 200) {
		
						body = JSON.parse(body);
						console.log('____________________________________________________________');
						console.log('____________________________________________________________');
						console.log(`\nTitle: ${body.Title}`);
						console.log(`Year: ${body.Year}`);
						console.log(`Rated: ${body.Rated}`);
						console.log(`Rotten Tomato Ratings: ${body.Ratings[1].Value}`);
						console.log(`Made in: ${body.Country}`);
						console.log(`Language: ${body.Language}`);
						console.log(`Actors: ${body.Actors}`);
						console.log(`\nPlot: ${body.Plot}`);
						console.log('____________________________________________________________');
						console.log('____________________________________________________________');

					} else {
						
						console.log('error:', error);
						console.log('statusCode:', response && response.statusCode); 
					
					}
				});
			});
		}
	} else console.log("Access Denied");


	});