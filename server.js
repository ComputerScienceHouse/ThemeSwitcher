// Pull in environment variables
require('dotenv').config();

// Define and connect to database
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var memberSchema = mongoose.Schema({
    uid: String,
    css: String,
  });

  Member= mongoose.model('Member', memberSchema);
});

// Configure the OpenID Connect strategy for use by Passport.
var passport = require('passport');
var Strategy = require('passport-openidconnect').Strategy;
passport.use(new Strategy({
  issuer: 'https://sso.csh.rit.edu/auth/realms/csh',
  authorizationURL: 'https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/auth',
  tokenURL: 'https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/token',
  userInfoURL: 'https://sso.csh.rit.edu/auth/realms/csh/protocol/openid-connect/userinfo',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.HOST + '/login/callback'
},
                          function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var express = require('express');
var app = express();

// Configure session handling
app.use(require('express-session')({ secret: process.env.EXPRESS_SESSION_SECRET, resave: true, saveUninitialized: true }));

// If on themes, redirect to themeswitcher
app.use(function(req, res, next) {
  if(req.hostname == "themes.csh.rit.edu")
    res.redirect("https://themeswitcher.csh.rit.edu" + req.path);
  else next();
});

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Authentication: authenticates with CSH OIDC and returns to origin point
app.get('/login',
        passport.authenticate('openidconnect'));

app.get('/login/callback',
        passport.authenticate('openidconnect', { failureRedirect: '/login' }),
        function(req, res) {
  res.redirect(req.session.returnTo);
});

// If no user is logged in, redirects to the default theme.
app.get('/api/get', function(req, res, next) {
  if(req.user) next(); // Passes to standard get
  else res.redirect(getTheme(process.env.DEFAULT_CSS).cdn);
});

// If no user is logged in, returns the default colour.
app.get('/api/colour', function(req, res, next){
  if(req.user) next(); // Passes control to standard colour
  else res.status(200).send(getTheme(process.env.DEFAULT_CSS).colour);
});

// Require auth for everything after the auth pages.
app.use(require('connect-ensure-login').ensureLoggedIn());

// Serve the frontend
app.use(express.static('pub'));

// Gets the list of themes
var themes = require("./pub/data/themes.json");

// Returnes the theme object with the given shortName
function getTheme(shortName) {
  for(var theme in themes) {
    if(themes[theme].shortName == shortName)
      return themes[theme];
  }
  return themes[0];
}

// Retrieves the users DB record
app.get('/api/get',
        function(req, res) {
  Member.findOne({ 'uid': req.user._json.preferred_username }, function(err, member) {
    var theme;
    if(member != null) {
      theme = getTheme(member.css);
    } else {
      theme = getTheme(process.env.DEFAULT_CSS);
    }
    res.redirect(theme.cdn);
  });
});

// Writes css to the user's DB record
app.get('/api/set/:css',
        function(req, res) {
  Member.findOne({ 'uid': req.user._json.preferred_username}, function(err, member) {
    if(member == null) {
      var u = new Member
      ({ 'uid': req.user._json.preferred_username, css: req.params.css });
      u.save(function(err, u) {
        if(err) res.status(404).send("Failed to save to database."); // Failure
        else res.status(204).send(""); // Created
      });
    } else {
      member.css = req.params.css;
      member.save(function(err, user) {
        if(err) res.status(404).send("Failed to save to database."); // Failure
        else res.status(204).send(""); // Success, no response
      });
    }
  });
});

app.get('/api/colour',
        function(req, res) {
  Member.findOne({ 'uid': req.user._json.preferred_username }, function(err, member) {
    if(member != null)
      res.status(200).send("#" + getTheme(member.css).colour);
    else res.status(200).send("#b0197e");
    // This is material primary. Hardcoding for now.
  });
});

// Returns data for configuring the static page
var git = require('git-rev');
var rev = "GitHub";
git.short(function(commit) {
  rev = commit;
});

app.get('/local',
        function(req, res) {
  var uid = req.user._json.preferred_username;
  var name = req.user._json.given_name + " " + req.user._json.family_name;
  res.status(200).send({ "uid": uid, "name": name, "rev": rev });
});

app.listen(parseInt(process.env.PORT));
