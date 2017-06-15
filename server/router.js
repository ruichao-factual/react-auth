import router from 'koa-router';
import jwt from 'koa-jwt';
import config from './config';

import {signin, signup} from './controllers/authentication';

const rootRouter = router();

rootRouter.post('/signin', signin);
rootRouter.post('/signup', signup);

rootRouter.use(jwt({ secret: config.secret, debug: true }));

rootRouter.get('/', async function(ctx, next) {
  ctx.body = ['java', 'python', 'javascript'];
});

module.exports = rootRouter;

