Spotify Download Tool
================

### Node.js implementation of the Spotify Web protocol


This module implements the "Spotify Web" WebSocket protocol that is used on
Spotify's [Web UI](http://play.spotify.com).

This module is heavily inspired by the original node module: [node-spotify-web](https://github.com/TooTallNate/node-spotify-web)


Installation
------------
1. Node.js: https://nodejs.org/en/download/
2. Python 2.7.9 or newer: https://www.python.org/downloads/
3. Run bash:
``` bash
$ npm install // Install all node modules
```
``` bash
$ pip install eyed3
$ pip install spotipy
```
4. Add your spotify authentication info to login.js file


Use Example
-------
1. Use terminal cd to savetify folder then run command:
``` bash
$ node download // Download single track by TrackID, spotify URI or track URL
```
or 
``` bash
$ node playlist // Download all track in playlist by playlist URI
```

2. After completed step 1, all track will be saved in /downloaded folder, but still missing track metadata. For update metadata.
``` bash
$ cd /renamer
$ python renamer.py 
```

=> Credit for @redphx

License
-------

(The MIT License)

Copyright (c) 2013-2014 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
