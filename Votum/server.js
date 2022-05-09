const express = require('express');
const session = require('express-session');
const { corsConfig } = require('./controllers/serverController');
const { Server } = require('socket.io');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const routers = require('./routers/routers.js');
const redisClient = require('./redis.js');
const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);
redisClient.connect();
require('dotenv').config();

const {
  initializeUser,
  getCurrentUser,
  questions,
  openQuestion,
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers
} = require('./controllers/socketController');
const pool = require('./db');
const { me } = require('./controllers/express/authController');

const server = require('http').createServer(app);

const io = new Server(server, {
  cors: corsConfig
});

app.use(express.static('client'));

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());

app.set('trust proxy', 1);
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 3600000
  }
});
app.use(sessionMiddleware);
app.use('/api', routers);

const wrap = middleware => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.authenticated) {
    next();
  } else {
    next(new Error('unauthorized'));
  }
});

io.on('connect', async socket => {
  socket.join('votum');
  // and then later
  initializeUser(socket);
  getCurrentUser(socket);
  // User Section

  socket.on('openQuestion', message => openQuestion(socket, message));

  socket.on('questions', () => questions(socket));

  socket.on('me', () => getCurrentUser(socket));

  // Admin section
  socket.on('adminRefresh', () => authorizeAdmin(socket, adminRefresh));

  socket.on('adminQuestions', () => authorizeAdmin(socket, adminQuestions));

  socket.on('adminUsers', () => authorizeAdmin(socket, adminUsers));
});

server.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});
