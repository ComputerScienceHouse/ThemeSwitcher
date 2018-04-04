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
    css: String
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

// Initialize Passport and restore authentication state, if any, from the
// session.
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

// Require auth for everything after the auth pages.
app.use( require('connect-ensure-login').ensureLoggedIn());

// Serve the frontend
app.use(express.static('pub'));

// Retrieves the users DB record
app.get('/api/:userID',
        function(req, res) {
  Member.findOne({ 'uid': req.params.userID }, function(err, member) {
    var uid = req.user._json.preferred_username;
    if(member != null)
      if(member.uid === uid || uid === process.env.ADMIN_UID)
        res.send(member.css);
      else res.send(process.env.DEFAULT_CSS);
    else res.send(process.env.DEFAULT_CSS);
  });
});

// Writes css to the user's DB record
app.get('/api/:userID/:css',
        function(req, res) {
  Member.findOne({ 'uid': req.params.userID}, function(err, member) {
    if(member == null) {
      var u = new Member
      ({ 'uid': req.params.userID, css: req.params.css });
      u.save(function(err, u) {
        if(err) res.status(404).send("Failed to save to database."); // Failure
        else res.status(204).send(""); // Created
      });
    } else {
      var uid = req.user._json.preferred_username;
      if(member.uid === uid || uid === process.env.ADMIN_UID) {
        member.css = req.params.css;
        member.save(function(err, user) {
          if(err) res.status(404).send("Failed to save to database."); // Failure
          else res.status(204).send(""); // Success, no response
        });
      } else res.status(403).send("Bad Credentials"); // Bad creds
    }
  });
});

// Returns the user for displaying the profile image and name.
app.get('/who',
        function(req, res) {
  var uid = req.user._json.preferred_username;
  var name = req.user._json.given_name + " " + req.user._json.family_name;
  res.status(202).send({"uid": uid, "name": name});
});

app.listen(parseInt(process.env.PORT));
