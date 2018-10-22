require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require('fs');
var keys = require('./keys');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);




runLIRI=(input, input2)=>{
  switch(input){

  case 'my-tweets':
  var params = {screen_name: 'Austin37242529'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if(error){
        console.log(error, `response code ${response}`);
      }
      if (!error) {
        console.log(tweets);
      }
  });

    break;
  case 'spotify-this-song':
      spotify.search({ type: 'track', query: input2 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var track = data.tracks.items;
        track.forEach(i => {
          console.log(
            `==========RESULT ${(track.indexOf(i))+1}==========\n 
            \tArtist: ${i.artists[0].name} \n 
            \tSong: ${i.name} \n          
            \tAlbum:  ${i.album.name}\n 
            \tSong Preview: ${i.external_urls.spotify}`);
        });
      });
    break;
  case 'movie-this':
  //display a bunch of shit from the omdb all pretty like
  request(`http://www.omdbapi.com/?apikey=2e81f936&t=${input2.split(' ').join('+')}`, function(error, response, body) {
    if(error){
      return console.log(error)
    }
    if (response.statusCode === 200){
      var movie = JSON.parse(body)
      console.log(
        `================${movie.Title}\n
         \tYear: ${movie.Year}\n
         \tRated: ${movie.Rated}\n
         \tCritic Ratings: \n
         \t\t IMDB: ${movie.Ratings[0].Value} 
         \t\t Rotten Tomatoes:${movie.Ratings[1].Value}
         \t\t Metecritic: ${movie.Ratings[2].Value}
         \tCountry/'s of Origin: ${movie.Country}\n
         \tActors: ${movie.Actors} \n
         \tLanguage: ${movie.Language}\n
         \tSynopsis: ${movie.Plot}\n
           `) 
    }
  })
    break;
}};

//=======argumrents
if(process.argv[2]==='do-what-it-says'){
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error){
      return console.log(error)
    }
    var dataArr = data.split(",")
    var input = dataArr[0];
    var input2 = dataArr[1];
    console.log(`
    Process Called: ${input}
    Parameters: ${input2}`)
    runLIRI(input, input2)
  });
}
else{
    var input =process.argv[2]
    var input2 =process.argv.slice(3).join(" ");
    runLIRI(input, input2)
};