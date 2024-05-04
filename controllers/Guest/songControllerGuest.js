const { Request } = require("../../models/request");
const { Song } = require("../../models/song");
const { User } = require("../../models/user");

//Add a track to the Database
const requestSong = async (req, res) => {
  try {
    const userId = req.user.userId;
    const songId = req.params.spotifyid;

    const user = await User.findById(userId);
    const song = await Song.findOne({
      spotifyId: songId,
    }).populate("songFeatures");

    if (!user || !song) {
      return res.status(500).json({
        success: false,
        message: "Request cannot be completed",
        data: null,
        errorMessage: !user ? "User not found" : "Requested track not found",
      });
    }

    const existingRequest =
      song.requestData.requestedUser === userId || song.requestData.isRequested;

    if (existingRequest) {
      return res.status(200).json({
        success: false,
        message: "This track already requested by someone",
        data: null,
        errorMessage: "This track already requested by someone",
      });
    }

    await Song.findOneAndUpdate(
      { spotifyId: songId },
      {
        "requestData.isRequested": true,
        "requestData.requestedUser": userId,
        "requestData.requestedTrack": songId,
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      success: true,
      message: "Track successfully added to the DJ's que",
      data: null,
      errorMessage: "Track successfully added to the DJ's que",
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      message: err.message,
      data: null,
      errorMessage: err.message,
    });
  }
};

const myRequests = async (req, res) => {
  const userId = req.user.userId;
  try {
    const myRequests = await Song.find({
      "requestData.requestedUser": userId,
    }).select("-requestData");
    if (!myRequests) {
      return res.status(200).json({
        success: false,
        message: "There is no any requested tracks by you",
        data: null,
        errorMessage: "There is no any requested tracks by you",
      });
    }
    res.status(200).json({
      success: true,
      message: "Requested tracks fetched successfully",
      data: myRequests,
      errorMessage: "Requested tracks fetched successfully",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: err.message,
      data: null,
      errorMessage: err.message,
    });
  }
};

exports.requestSong = requestSong;
exports.myRequests = myRequests;