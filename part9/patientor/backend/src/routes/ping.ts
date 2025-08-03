import express from 'express';

const pingRouter = express.Router();

pingRouter.get('/', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

export default pingRouter;