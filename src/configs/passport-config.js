const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const settings = require('./settings')
const User = require('../models/user')

exports.passportStrategy = passport => {
    let opts = {}
    const JWT_KEY = settings.config.passport.secret;
    console.log("jwt key:" + JWT_KEY)
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = JWT_KEY;
    console.log("jwt beaer:" + opts.jwtFromRequest)
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("jwt-payload:" + JSON.stringify(jwt_payload))
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}