// var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
// var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
const bcryptjs = require('bcryptjs');
var localStrategy = require('passport-local').Strategy;

passport.use(
  new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    user.findOne({ email: email }, (err, data) => {
      if (err) throw err;
      if (!data) {
        return done(null, false, { message: "User Doesn't Exist !" });
      }
      bcryptjs.compare(password, data.password, (err, match) => {
        if (err) {
          return done(null, false);
        }
        if (!match) {
          return done(null, false, { message: "Password Doesn't match !" });
        }
        if (match) {
          return done(null, data);
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  user.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      var profileData = {
        name: profile._json.name,
        username: profile._json.given_name,
        email: profile._json.email,
        photo: profile._json.avatar_url,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);

            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var profileData = {
        name: profile.username,
        username: profile.username,
        email: profile._json.email,
        photo: profile._json.picture,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
