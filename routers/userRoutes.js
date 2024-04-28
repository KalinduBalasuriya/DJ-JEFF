const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  signUp,
  login,
  getUsers,
  getCurrentUser,
} = require("../controllers/userController");
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const {
  spotifyAuthCode,
  spotifyAuthorization,
  spAuth,
} = require("../Authentication/spotifyAuth");

router.post("/login", login);
router.post("/signup", signUp);
router.get("/allusers", authJwt(), validateRole(["Admin"]), getUsers);
router.get("/currentuser", authJwt(), getCurrentUser);

module.exports = router;
