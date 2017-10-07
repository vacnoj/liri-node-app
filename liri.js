var keys = require('./keys.js');

var Twitter = require('twitter');

var Spotify = require('node-spotify-api'); 

var inquirer = require('inquirer');

var request = require('request');

var fs = require('fs');

const password = "1";

var access = false;

inquirer.prompt([
	{
		type: "password",
		message: "What is your password?",
		name: "password",
		mask: "ha"
	}
]).then(function(userpassword) {
	if(userpassword.password == password || access) {
		console.log(`Welcome, Jon!`);
		access = true;
		main();
	} else console.log("Access Denied");
});

function main() {
inquirer.prompt([
	{
		type: "list",
		choices: ["my-tweets", "spotify", "movie IMDB", "do what it says"],
		message: "What do you want to do?",
		name: "action"
	}
])

.then(function (inquirerResponse) {
	

	if (inquirerResponse.action === 'my-tweets') {
		
		tweeter();
			
	} else if (inquirerResponse.action === 'spotify') {
		
		spotify();

	} else if(inquirerResponse.action === "movie IMDB") {

		imdb();

	} else if (inquirerResponse.action === "do what it says") {
		
		doRandom();

	}
});
}

function imdb() {
	
	inquirer.prompt([
		{
			tpye: 'input',
			message: 'What movie?',
			name: 'movie'
		}
	])
	.then(function(movie) {
		if (!movie.movie) {
			movie.movie = "Mr. Nobody";
		}
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
		}); setTimeout(doAnother, 2000);
	});
}

function tweeter() {

		var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	client.get('statuses/user_timeline', function(error, tweets, response) {

		if (!error) {
			for (var i = 0; i < tweets.length && i < 20; i++) {
				console.log('____________________________________________________________');
				console.log(`\nCreated: ${tweets[i].created_at}`);
				console.log(`Tweet: ${tweets[i].text}`);
				console.log('\n____________________________________________________________');
			}
		} else console.log("error: ", error);
	}); setTimeout(doAnother, 2000);
}

function spotify(song) {
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

	if (!song.song) {
		song.song = "The Sign";
	}
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
	}); setTimeout(doAnother, 2000);
	
	});
}

function doRandom() {
	fs.readFile("random.txt", "utf8", function(error, data) {

		if (!error) {
			
			var dataArray = data.split(",");
			song = dataArray[Math.floor(Math.random()*5)];
			spotifyCall(song);

		} else console.log('error: ', error);
	}); setTimeout(doAnother, 2000);
}

function spotifyCall(song) {

var spotify = new Spotify({
	id: keys.spotifyKeys.id,
	secret: keys.spotifyKeys.secret
});

spotify.search({ type: 'track', query: song }, function(error, data) {
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
}); //setTimeout(doAnother, 2000);
}

function doAnother() {
	inquirer.prompt([
		{
			type: 'confirm',
			message: "Do you want to do another?",
			name: 'doAnother'
		}
	]).then(function(doAnother) {
		
		if (doAnother.doAnother) {
			main();
		}
	})
}