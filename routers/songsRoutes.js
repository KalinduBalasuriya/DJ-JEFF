const express = require("express");
const {
  getAllSongs,
  getCategoryPlaylists,
  getPlaylist,
  addTracks,
} = require("../controllers/Admin/songsControllerAdmin");
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const { getCategories } = require("../controllers/Admin/songsControllerAdmin");
const { checkToken } = require("../Authentication/spotifyAuth");
const {
  requestSong,
  myRequests,
} = require("../controllers/Guest/songControllerGuest");
const router = express.Router();

//routes for songs
router.get("/allsongs", getAllSongs);
router.get("/allcategories", checkToken, getCategories);
router.get("/categories/:categoryid", checkToken, getCategoryPlaylists);
router.get("/categoryplaylists/:playlistid", checkToken, getPlaylist);
router.post("/addtracks", checkToken, addTracks);

//routes for users
router.put("/guestuser/requestsong/:spotifyid", authJwt(), requestSong);
router.get("/guestuser/myrequests/", authJwt(), myRequests);

// router.post("/addsong", authJwt(), validateRole(["Admin"]), addSong);

module.exports = router;
