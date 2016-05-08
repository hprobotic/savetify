/*
  Savetify for Node.js
  version 1.0.0
  Ext: Download Spotify by Playlist URI
  http://fb.com/cpt1512
 */

var Spotify = require('./lib/spotify');
var login = require('./login');
var prompt = require('prompt');
var fs = require('fs');
var sanitize = require("sanitize-filename");

var DOWNLOADED_DIR = './downloaded';

function getPlayListContent(spotify, playListId, callback) {
  var uri = playListId;
  console.log(uri);
  var type = Spotify.uriType(uri);
  if ('playlist' != type) {
    throw new Error('Must pass a "playlist" URI, got ' + JSON.stringify(type));
  }
// initiate the Spotify session
  Spotify.login(login.username, login.password, function (err, spotify) {
    if (err) throw err;
    spotify.playlist(uri, function (err, playlist) {
      if (err) throw err;
      spotify.disconnect();
      result =  playlist.contents;
      return result;
    });
  });

}

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
    var playListId = result.songId;
    var uri = playListId; 
    var type = Spotify.uriType(uri);
    if ('playlist' != type) {
      throw new Error('Must pass a "playlist" URI, got ' + JSON.stringify(type));
    }
// initiate the Spotify session
    var result = [];
    function getTrack(callback) {
      Spotify.login(login.username, login.password, function (err, spotify) {
        if (err) throw err;
        spotify.playlist(uri, function (err, playlist) {
          if (err) throw err;
          spotify.disconnect();
          result = playlist.contents.items;
          return callback(result);
        });
      });
    }
    getTrack(function(result){
      for (i = 0; i < result.length; i++) {
        songURI = result[i].uri;
        songId = songURI.split('/').pop();
        songId = songURI.split(':').pop();
        setTimeout(function(songId) {
          console.log('== Downloading songId ' + songId);
          downloadSong(spotify, songId, function() {
            //console.log('-- Downloaded songId ' + songId);
          });
        }, 5000*i, songId);
      }
      console.log('== Download completed: ' + result.length + 'track ')
    })
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
