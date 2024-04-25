const { Song } = require("../models/song");

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

exports.getAllSongs = getAllSongs;
exports.addSong = addSong;
