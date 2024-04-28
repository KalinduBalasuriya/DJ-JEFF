const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const {
  spotifyAuthorization,
  spAuth,
} = require("./Authentication/spotifyAuth");
const spotifyWebAPI = require("spotify-web-api-node");

app.use(cors());
app.options("*", cors());
require("dotenv/config");

app.use(bodyParser.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;

//spotify auth
// app.get("/", spotifyAuthorization);

app.get("/", spAuth);

app.get("/callback", (req, res) => {
  const code = req.query.code;
  console.log("AuthCode Received: ", code);
  res.status(200).json({
    authcode: code,
  });
});

//Routes
const usersRouter = require("./routers/userRoutes");
const songsRouter = require("./routers/songsRoutes");

app.use(`${api}/users`, usersRouter);
app.use(`${api}/songs`, songsRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "dj-jeff-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("server is runnning on http://localhost:3000");
});
