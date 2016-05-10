/*
  Savetify for Node.js
  version 2.0.0
  Ext: Download Spotify by Playlist, Album, Track URI
  http://fb.com/cpt1512
 */

var Spotify = require('./lib/spotify');
var login = require('./login');
var prompt = require('prompt');
var fs = require('fs');
var sanitize = require("sanitize-filename");
var delayDown = 1000; // delay per switch to other track ms, raise this number if network not too good;
var DOWNLOADED_DIR = './downloaded';


function downloadSong(spotify, uri, callback) {
  var uri = uri;
  songId = uri.split('/').pop();
  songId = uri.split(':').pop();
  spotify.get(uri, function (err, track) {
    var artists = '';
    track.artist.forEach(function (artist) {
      if (artists.length > 0) {
        artists += ' & ';
      }
      artists += artist['name'];
    });
    var filename = sanitize(artists + ' - ' + track.name + ' [' + songId + ']');
    var write = fs.createWriteStream(DOWNLOADED_DIR + '/' + filename + '.tmp');

    track.play()
      .pipe(write)
      .on('finish', function () {
        fs.rename(DOWNLOADED_DIR + '/' + filename + '.tmp', DOWNLOADED_DIR + '/' + filename + '.mp3');
        callback();
      });
  });
}

function getSong(spotify) {
  prompt.start();
  prompt.get(['spotifyURI'], function (err, result) {
    var spotifyURI = result.spotifyURI;
    var uri = spotifyURI;
    var type = Spotify.uriType(uri);
    if ('playlist' == type) {
      // first get a "Playlist" instance from playlist URI
      spotify.playlist(uri, function (err, playlist) {
        if (err) throw err;
        var tracks = [];
        playlist.contents.items.forEach(function (track) {
          tracks.push(track);
        });
        var i = 0;
        tracks.map(function (t) {
          i++;
          songURI = t.uri;
          setTimeout(function (songURI) {
            downloadSong(spotify, songURI, function () {
            });
          }, delayDown * i, songURI);
        });
        setTimeout(function () {
          getSong(spotify);
        }, 0);
      });
    } else if ('album' == type) {
      // first get a "Album" instance from album URI
      spotify.get(uri, function (err, album) {
        if (err) throw err;
        var tracks = [];
        album.disc.forEach(function (disc) {
          if (!Array.isArray(disc.track)) return;
          tracks.push.apply(tracks, disc.track);
        });
        var i = 0;
        tracks.map(function (t) {
          i++;
          songURI = t.uri;
          setTimeout(function (songURI) {
            downloadSong(spotify, songURI, function () {
            });
          }, delayDown * i, songURI);
        });
        setTimeout(function () {
          getSong(spotify);
        }, 0);
      });
    } else if ('track' == type) {
        songURI = uri;
        setTimeout(function () {
          console.log('== Downloading songURI ' + songURI);
          downloadSong(spotify, songURI, function () {
          });
        }, 0);
        setTimeout(function () {
          getSong(spotify);
        }, 0);
    }

  });
}

// initiate the Spotify session
console.log('Logging in...');
Spotify.login(login.username, login.password, function (err, spotify) {
  if (err) throw err;
  console.log('Logged in successfully!');

  if (!fs.existsSync(DOWNLOADED_DIR)) {
    fs.mkdirSync(DOWNLOADED_DIR);
  }

  getSong(spotify);
});
