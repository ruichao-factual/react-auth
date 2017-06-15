import jwt from 'jsonwebtoken';
import passport from 'koa-passport';

import User from '../models/user';
import config from '../config';

function tokenForUser(user) {
  const exp = new Date().getTime() + 60 * 1000;
  return jwt.sign({ sub: user.email, exp }, config.secret);
}

const signup = async function (ctx, next) {
  const email = ctx.request.body.email;
  const password = ctx.request.body.password;

  if (!email || !password) {
    ctx.throw('You must provie Email and Password!', 422)
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    ctx.throw('Email is in use!', 422);
  }

  const user = new User({
    email: email,
    password: password
  });

  await user.save();
  ctx.body = { token: tokenForUser(user) };

};

const signin = async function (ctx, next) {
  return passport.authenticate('local', (err, user, info) => {
    if (user === false) {
      ctx.status = 401;
      ctx.body = 'password incorrect';
    } else {
      ctx.body = { token: tokenForUser(user) };
    }
  })(ctx, next);
}

export { signin, signup };

