const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      mongoose = require('mongoose'),
      User = mongoose.model('users'),
      keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secrectOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id).exec();
            return user ? done(null, user) : done(null, false);
        } catch (err) {
            throw err;
        }        
    }));
};