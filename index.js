const express = require('express');
const passport = require('passport');
const compression = require('compression');
const cors = require('cors');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const { initialSocket } = require('./socketio');
const { sessionMiddleware } = require('./utils');

const router = require('./routes');
const db = require('./database');

const app = express();

// compress all responses
app.use(compression());

const allowedDomains = ['scanner.pruebasinfo.xyz', 'http://localhost:3000'];

app.use(
  cors({
    origin(origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);
      return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '5mb' }));
app.use(
  express.urlencoded({ limit: '5mb', extended: true, parameterLimit: 1000 }),
);

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

router(app);
db();

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: ['http://localhost:3001'],
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// const wrap = middleware => (socket, next) =>
//   middleware(socket.request, {}, next);
//
// io.use(wrap(sessionMiddleware));
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()));

// initialSocket(io);

app.listen(8001, () => {
  console.log('Estoy en el puerto 8001');
});
