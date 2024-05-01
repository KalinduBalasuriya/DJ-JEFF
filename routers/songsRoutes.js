const express = require("express");
const {
  getAllSongs,
  addSong,
  getCategoryPlaylists,
  getPlaylist,
  test,
} = require("../controllers/songsController");
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const { getCategories } = require("../controllers/songsController");
const { checkToken } = require("../Authentication/spotifyAuth");
const router = express.Router();

router.get("/allsongs", getAllSongs);
router.get("/allcategories", checkToken, getCategories);
router.get("/categories/:categoryid", checkToken, getCategoryPlaylists);
router.get("/categoryplaylists/:playlistid", checkToken, getPlaylist);
router.post("/test", checkToken, test);

router.post("/addsong", authJwt(), validateRole(["Admin"]), addSong);

module.exports = router;
