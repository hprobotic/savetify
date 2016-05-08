#!/usr/bin/python2.7

import sys, os
import urllib2
import re
import eyed3, spotipy

spotify = spotipy.Spotify()

def process_filename(filename):
  filename = re.sub('[/\\\:]+', '-', filename)
  filename = re.sub('[*?"<>|:]+', '', filename)
  filename = re.sub('[\-]+', '-', filename)
  filename = re.sub('\s+', ' ', filename)
  return filename

def get_track_info(track_id):
  track = spotify.track(track_id)
  track_info = {}

  track_info["title"] = track["name"]

  album = track["album"]
  cover = ""
  if (album["images"]):
    cover = album["images"][0]["url"]
  track_info["cover"] = cover
  track_info["album"] = album["name"]

  track_info["artist"] = ", ".join(x["name"] for x in track["artists"])

  track_info["comments"] = u"spotify:track:" + track_id

  print(track_info)
  return track_info

def process_file(fn, input_dir, output_dir):
  input_file = os.path.join(input_dir, fn)
  split = os.path.splitext(fn)
  song_name = split[0]
  track_id = re.search('\[([^]]+)\]', song_name).group(1);
  extension = split[1]

  track_info = get_track_info(track_id)

  mp3_file = eyed3.load(input_file)
  if mp3_file.tag is None:
    mp3_file.tag = eyed3.id3.Tag()
    mp3_file.tag.file_info = eyed3.id3.FileInfo(os.path.join(input_dir, fn))

  mp3_file.tag.title = track_info["title"]
  mp3_file.tag.album = track_info["album"]
  mp3_file.tag.artist = track_info["artist"]
  mp3_file.tag.comments.set(track_info["comments"])

  if (track_info["cover"]):
    response = urllib2.urlopen(track_info["cover"])
    cover = response.read()
    mp3_file.tag.images.set(3, cover, "image/jpeg")

  mp3_file.tag.save()

  output_filename = process_filename(track_info["artist"] + " - " + track_info["title"]) + extension
  output_file = os.path.join(output_dir, output_filename)
  os.rename(input_file, output_file)

def process_dir(input_dir):
  processed_dir = os.path.join(input_dir, "processed")
  if not os.path.exists(processed_dir):
    os.makedirs(processed_dir)

  # loop for files
  for fn in os.listdir(input_dir):
    if (os.path.isfile(os.path.join(input_dir, fn))):
      extension = os.path.splitext(fn)[1]
      if (extension == ".mp3"):
        process_file(fn, input_dir, processed_dir)


if __name__ == "__main__":

  if len(sys.argv) >= 2:
    input_dir = sys.argv[1]
  else:
    input_dir = '../downloaded'
    if not os.path.exists(input_dir):
      os.makedirs(input_dir)

  if not os.path.isdir(input_dir):
    print("invalid dir")
    sys.exit(0)

  process_dir(input_dir)