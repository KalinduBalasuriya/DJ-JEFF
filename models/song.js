const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
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
});

songSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

songSchema.set("toJSON", {
  virtuals: true,
});

exports.Song = mongoose.model("Song", songSchema);
