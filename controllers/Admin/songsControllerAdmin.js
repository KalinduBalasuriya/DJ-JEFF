const { Song } = require("../../models/song");
const spotifyAPI = require("../../app");
const { SongFeature } = require("../../models/songFeature");

/////////////////Get all categories from Spotify (For Admin)
const getCategories = async (req, res) => {
  spotifyAPI.spotifyAPI
    .getCategories({
      limit: 20,
    })
    .then(
      function (data) {
        res.status(200).json({
          success: true,
          message: "Categories fetched",
          data: {
            songs: data.body.categories.items,
          },
          errorMessage: null,
        });
      },
      function (err) {
        res.status(500).json({
          success: false,
          message: "Categories fetching failed",
          data: {
            songs: null,
          },
          errorMessage: err.message,
        });
      }
    );
};

///////////////////////Get all playlists belong to a category//////////////////////////
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
          success: true,
          message: "Playlists of the category fetched",
          data: {
            songs: data.body.playlists.items,
            // token: req.headers["authorization"],
          },
          errorMessage: null,
        });
      },
      function (err) {
        res.status(500).json({
          success: false,
          message: "Category playlists fetching failed",
          data: {
            songs: null,
          },
          errorMessage: err.message,
        });
        console.log("Something went wrong!", err);
      }
    );
};

///////////////////////////////Get tracks according to the track id//////////////////////
const addTracks = async (req, res) => {
  const trackIds = req.body;

  try {
    //Fetching audio tracks
    const songTracks = await spotifyAPI.spotifyAPI.getTracks(trackIds);
    if (!songTracks) {
      return res.status(500).json({
        success: false,
        message: "No tracks found from Spotify",
        data: {
          songs: null,
          // token: req.headers["authorization"],
        },
        errorMessage: "Fetch tracks from Spotify failed",
      });
    }

    //Fetching audio features of tracks
    const audioFeatures =
      await spotifyAPI.spotifyAPI.getAudioFeaturesForTracks(trackIds);

    // Filter null values of tracks
    let tracks = songTracks.body.tracks;
    tracks = tracks.filter((track) => track !== null);

    // Filter null values of audio features
    let features = audioFeatures.body.audio_features;
    features = features.filter((feature) => feature !== null);

    //Filter ids of tracks didn't fetched from spotiify
    const nullTracks = trackIds.filter(
      (trackId) => !tracks.some((track) => track.id === trackId)
    )[0];

    //Filter ids of audio features didn't fetched from spotiify
    const nullFeatures = trackIds.filter(
      (trackId) => !features.some((feature) => feature.id === trackId)
    );

    //saving audio track in Database
    for (const element of tracks) {
      const existingSong = await Song.findOne({ spotifyId: element.id });

      if (!existingSong) {
        let song = new Song({
          spotifyId: element.id,
          songName: element.name,
          artistName: element.artists[0].name,
          imageUrl: element.album.images[2].url,
          isRequested: false,
          isPlayed: false,
          userRequestCount: 0,
        });
        song = await song.save();
      }
    }

    //saving audio track in Database
    for (element of features) {
      const existingFeature = await SongFeature.findOne({
        spotifyId: element.id,
      });
      if (!existingFeature) {
        let feature = new SongFeature({
          spotifyId: element.id,
          dancability: element.dancability,
          bpm: element.tempo,
          loudness: element.loudness,
        });
        feature = await feature.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Songs added to the Database successfully",
      data: {
        missingSongIds: nullTracks,
        missingAudioFeatureIds: nullFeatures,
      },
      errorMessage: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "playlist fetching failed",
      data: {
        songs: null,
        // token: req.headers["authorization"],
      },
      errorMessage: err.message,
    });
  }
};

///////////////////////////////Get a playlist of a category using a category ID//////////////////////////
const getPlaylist = async (req, res) => {
  const playListId = req.params.playlistid;
  spotifyAPI.spotifyAPI.getPlaylist(playListId).then(
    function (data) {
      res.status(200).json({
        success: true,
        message: "Playlist fetched successfuly",
        data: {
          songs: data.body.tracks.items,
          // token: req.headers["authorization"],
        },
        errorMessage: null,
      });
    },
    function (err) {
      res.status(500).json({
        success: false,
        message: "playlist fetching failed",
        data: {
          songs: null,
          // token: req.headers["authorization"],
        },
        errorMessage: err.message,
      });
      console.log("Something went wrong!", err);
    }
  );
  ////////////////////////////////////////////////////
};

///////////////////////////////Get all the songs in our Database/////////////////////////
const getAllSongs = async (req, res) => {
  const songList = await Song.find().populate("songFeatures");
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
  const dataCount = songList.length;
  return res.status(200).json({
    success: true,
    message: "Songs fetched successfuly",
    data: {
      songs: songList,
      count: dataCount,
      // token: req.headers["authorization"],
    },
    errorMessage: "Songs fetched successfuly",
  });
};

exports.addTracks = addTracks;
exports.getCategoryPlaylists = getCategoryPlaylists;
exports.getPlaylist = getPlaylist;
exports.getCategories = getCategories;
exports.getAllSongs = getAllSongs;
