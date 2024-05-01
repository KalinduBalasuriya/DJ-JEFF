const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
  },
  songName: {
    type: String,
    required: true,
  },
  BPM: {
    type: Number,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  isRequested: {
    type: Boolean,
    default: false,
  },
  isPlayed: {
    type: Boolean,
    default: false,
  },
  userRequestCount: {
    type: Number,
    default: 0,
  },
});

songSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

songSchema.set("toJSON", {
  virtuals: true,
});

exports.Song = mongoose.model("Song", songSchema);
