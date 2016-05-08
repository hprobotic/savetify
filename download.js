/*
  Savetify for Node.js
  version 1.0.0
  http://fb.com/redphx
 */

var Spotify = require('./lib/spotify');
var login = require('./login');
var prompt = require('prompt');
var fs = require('fs');
var sanitize = require("sanitize-filename");

var DOWNLOADED_DIR = './downloaded';

function downloadSong(spotify, songId, callback) {
  var uri = 'spotify:track:' + songId;
  spotify.get(uri, function (err, track) {
    var artists = '';
    track.artist.forEach(function(artist) {
      if (artists.length > 0) {
        artists += ' & ';
      }
      artists += artist['name'];
    });
    var filename = sanitize(artists + ' - ' + track.name + ' [' + songId + ']');
    var write = fs.createWriteStream(DOWNLOADED_DIR + '/' + filename + '.tmp');

    track.play()
      .pipe(write)
      .on('finish', function() {
        fs.rename(DOWNLOADED_DIR + '/' + filename + '.tmp', DOWNLOADED_DIR + '/' + filename + '.mp3');
        callback();
      });
  });
}

function getSong(spotify) {
  prompt.start();
  prompt.get(['songId'], function (err, result) {
    var songId = result.songId;
    songId = songId.split('/').pop();
    songId = songId.split(':').pop();

    setTimeout(function() {
      console.log('== Downloading songId ' + songId);
      downloadSong(spotify, songId, function() {
        //console.log('-- Downloaded songId ' + songId);
      });
    }, 0);
    setTimeout(function() {
      getSong(spotify);
    }, 0);
  });
}

// initiate the Spotify session
console.log('Logging in...');
Spotify.login(login.username, login.password, function (err, spotify) {
  if (err) throw err;
  console.log('Logged in successfully!');

  if (!fs.existsSync(DOWNLOADED_DIR)){
    fs.mkdirSync(DOWNLOADED_DIR);
  }

  getSong(spotify);
});
