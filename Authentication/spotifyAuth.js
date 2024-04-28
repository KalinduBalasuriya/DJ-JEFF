const SpotifyWebApi = require("spotify-web-api-node");

// let spotifyAccessToken = null;
// let spotifyTokenExpiresIn = null;
// let spotifyAPI = null;
// const spotifyAuthorization = async (req, res, next) => {
// let spotifyApi = new spotifyWebAPI({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
// });
//   spotifyAPI = spotifyApi;
//   try {
//     const tokenData = await spotifyApi.clientCredentialsGrant();

//     spotifyApi.setAccessToken(tokenData.body["access_token"]);

//     spotifyAccessToken = tokenData.body["access_token"];
//     spotifyTokenExpiresIn = tokenData.body["expires_in"];

//     res.status(200).json({
//       token: tokenData.body["access_token"],
//       tokenExpiresIn: tokenData.body["expires_in"],
//     });
//   } catch (err) {
//     res.send(err.message);
//   }

//   console.log(spotifyAPI);
// };
var scopes = ["user-read-private", "user-read-email"];

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const spAuth = async (req, res) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  const authoURL = spotifyApi.createAuthorizeURL(scopes);

  res.redirect(authoURL);
};

exports.spAuth = spAuth;
// exports.spotifyAuthorization = spotifyAuthorization;
