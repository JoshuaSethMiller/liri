var request = require('request');
var twitter_keys = require('./keys.js');
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');



var userInput = process.argv;
var task = userInput[2];
var question = userInput[3];

if(process.argv.length >= 4) {
	for(i = 4; i < process.argv.length; i++) {
		question += '+' + userInput[i];
	}
}

console.log(task + ' ' + question);



var tweetFunction = function() {
	var client = new twitter ({
		consumer_key: twitter_keys.twitterKeys.consumerKey,
		consumer_secret: twitter_keys.twitterKeys.consumerSecret,
		access_token_key: twitter_keys.twitterKeys.access_token_key,
		access_token_secret: twitter_keys.twitterKeys.access_token_secret
	});

	if(question == undefined) {
		question = 'nathan fillion';
	}

	client.get('statuses/user_timeline', {screen_name: question, count: 20}, function(error, tweets, response) {
		if(error) {
			console.log(error);
		}
		for(var prop in tweets) {
			console.log(tweets[prop].text);
			console.log(tweets[prop].created_at);
			fs.appendFile('./log.txt', tweets[prop].txt + tweets[prop].created_at, function(err) {
				if(err) {
					console.log(err);
				}
			})
		}
	})
};



var song = function(string) {

	console.log('hi');

	if( question == undefined) {
		question = "whats+my+age+again";
	}

	var queryUrl = 'https://api.spotify.com/v1/search?q=' + question + '&type=track&limit=1';

	spotify.get(queryUrl, function(error, data) {

		if (error) {
			console.log(error);
		} else{

			var songObject = data;
			console.log(songObject);

			var text = {
				artist: songObject.tracks.items[0].artists[0].name,
				song_name: songObject.tracks.items[0].items[0].name,
				link: songObject.tracks.items[0].preview_url,
				album: songObject.tracks.items[0].album.name
			}



			fs.appendFile('./log.txt', question);
			fs.appendFile('./log.txt', text);
		}
	})

};



var movie = function(string) {
	if( question == undefined ) {
		question = 'cyrano de bergerac';
	}

	var queryUrl = 'http://www.omdbapi.com/?t=' + question +'&tomatoes=true';

	console.log(queryUrl)
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('it works');
			var movieObject = JSON.parse(body);
			console.log('title: ' + movieObject.Title);
			console.log('year: ' + movieObject.Year);
			console.log('rating: ' + movieObject.imdbRating);
			console.log('country: ' + movieObject.Country);
			console.log('language: ' + movieObject.Language);
			console.log('plot ' + movieObject.Plot);
			console.log('actors: ' + movieObject.Actors);
			console.log('rottenRating: ' + movieObject.rottenRating);
			console.log('rottenURL: ' + movieObject.tomatoURL);

			var text = JSON.stringify({
				title: movieObject.Title,
				year: movieObject.Year,
				rating: movieObject.imdbRating,
				country: movieObject.Country,
				language: movieObject.Language,
				plot: movieObject.Plot,
				actors: movieObject.Actors,
				rottenRating: movieObject.tomatoRating,
				rottenURL: movieObject.tomatoURL
			})

			fs.appendFile('./log.txt', question);
			fs.appendFile('./log.txt', text);
		}
	})


};



var says = function() {
	fs.readFile('./random.txt', 'utf8', function(err, data) {
		if (err) {
			console.log(err);
		}
		data = question;
		console.log('data');
		song(question);
	})
};


switch(task) {
	case 'movie-this':
		movie(question);
		break;
	case 'my-tweets':
		tweetFunction(question);
		break;
	case 'spotify-this-song':
		song(question);
		break;
	case 'do-what-it-says':
		says();
		break;
	default:
		says();
}
