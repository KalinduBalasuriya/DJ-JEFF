const express = require("express");
const { getAllSongs, addSong } = require("../controllers/songsController");
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const router = express.Router();

router.get("/allsongs", getAllSongs);

router.post("/addsong", authJwt(), validateRole(["Admin"]), addSong);

module.exports = router;
