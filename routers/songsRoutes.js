const express = require("express");
const { getAllSongs, addSong } = require("../controllers/songsController");
const router = express.Router();

router.get("/allsongs", getAllSongs);

router.post("/addsong", addSong);

module.exports = router;
