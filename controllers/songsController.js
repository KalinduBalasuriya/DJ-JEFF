const { Song } = require("../models/song");
const spotifyAPI = require("../app");

//Get all categories from Spotify (For Admin)
const getCategories = async (req, res) => {
  spotifyAPI.spotifyAPI
    .getCategories({
      limit: 20,
    })
    .then(
      function (data) {
        res.status(200).json({
          items: data.body.categories.items,
        });
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
};

//Get all playlists belong to a category
const getCategoryPlaylists = async (req, res) => {
  const categoryId = req.params.categoryid;
  spotifyAPI.spotifyAPI
    .getPlaylistsForCategory(categoryId, {
      limit: 20,
      offset: 0,
    })
    .then(
      function (data) {
        res.status(200).json({
          data: data.body.playlists.items,
        });
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
};

//Get a playlist using a category ID
const getPlaylist = async (req, res) => {
  const playListId = req.params.playlistid;
  spotifyAPI.spotifyAPI.getPlaylist(playListId).then(
    function (data) {
      res.status(200).json({
        data: data,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
};
const getAllSongs = async (req, res) => {
  const songList = await Song.find();

  if (!songList) {
    return res(200).json({
      success: false,
      message: "No songs found!",
      data: {
        songs: null,
        // token: req.headers["authorization"],
      },
      errorMessage: "Songs not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Songs fetched successfuly",
    data: {
      songs: songList,
      // token: req.headers["authorization"],
    },
    errorMessage: "Songs fetched successfuly",
  });
};

const addSong = async (req, res) => {
  let song = new Song({
    songName: req.body.songName,
    BPM: req.body.bpm,
    artistName: req.body.artistName,
  });

  song = await song.save();
  if (!song)
    return res.status(400).json({
      success: false,
      message: "Song cannot be added",
      data: {
        songs: null,
        // token: req.headers["authorization"],
      },
      errorMessage: "Song cannot be added",
    });
  return res.status(200).json({
    success: true,
    message: "Songs added successfuly",
    data: {
      songs: song,
      // token: req.headers["authorization"],
    },
    errorMessage: "Song added successfuly",
  });
};

exports.getCategoryPlaylists = getCategoryPlaylists;
exports.getPlaylist = getPlaylist;
exports.getCategories = getCategories;
exports.getAllSongs = getAllSongs;
exports.addSong = addSong;
