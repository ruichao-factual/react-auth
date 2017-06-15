import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import morgan from 'koa-morgan';
import mongoose from 'mongoose';
import route from 'koa-route';
import cors from 'koa-cors';

import passport from './services/passport';
import config from './config';

// DB steup
mongoose.connect('mongodb://localhost:auth/auth');

const router = require('./router');

const app = new Koa();

// Error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.stats = 401;
      ctx.body = 'Protected resource, use Authorization header to get access.';
    } else {
      ctx.status = err.status || 500;
      ctx.body = { error:  err.message };
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(passport.initialize());

app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser());

app
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 3090;

app.listen(port);

console.log(`Server listening on ${port}`);

