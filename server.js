var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},

function(accessToken, refreshToken, profile, cb) {
    googleProfile = {
        id: profile.id,
        displayName: profile.displayName
    };
    cb(null, profile);
}
));

app.set('view engine', 'pug'); //będziemy używać Puga jako kreatora widoków
app.set('views','./views'); //widoki będziemy trzymać w katalogu /views
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('main', { user: req.user });
});

app.get('/signin', function (req, res) {
    res.render('signin');
});

app.get('/log', function (req, res) {
    res.render('log', {
		first_name: req.query.first_name,
        last_name: req.query.last_name,
        user: googleProfile
    });
    
});

app.get('/auth/google',
	passport.authenticate('google', {
		scope : ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/log',
        failureRedirect: '/'
}));

const server = app.listen(3000, 'localhost', function() {
	const host = server.address().address;
    const port = server.address().port;
    
    console.log('Aplikacja nasłuchuje na http://' + host + ':' + port);

});