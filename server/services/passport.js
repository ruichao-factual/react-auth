import passport from 'koa-passport';
import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user';


// local strategy
const localOptions = { usernameField: 'email' }
passport.use(new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this username and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return done(null, false);
    }

    // compare password
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }

      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });

  }).catch((err) => {
    done(err);
  })

}));


export default passport;

