const express = require('express');
const { corsConfig } = require('./controllers/serverController');
const { Server } = require('socket.io');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const {
  initializeUser,
  authorizeUser,
  questions,
  openQuestion,
  vote,
  adminRefresh,
  authorizeAdmin,
  adminQuestions,
  adminUsers,
  adminAddAnswer,
  adminModifyAnswer,
  adminRemoveAnswer,
  adminAddQuestion,
  adminModifyQuestnion,
  adminRemoveQuestion,
  adminSetQuestionShowAnswers,
  adminAddUser,
  adminModifyUser,
  adminRemoveUser,
  adminSetUserPrivilage,
  adminImportUsers
} = require('./controllers/socketController');
const pool = require('./db');

const server = require('http').createServer(app);

const io = new Server(server, {
  cors: corsConfig
});

app.use(express.static('client'));

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use('/auth', authRouter);

app.set('trust proxy', 1);

io.use(authorizeUser);
io.on('connect', async socket => {
  socket.join('votum');

  // and then later
  io.to(socket.id).emit('message', { message: 'Hello' });

  initializeUser(socket);
  // User Section

  socket.on('openQuestion', message => openQuestion(socket, message));

  socket.on('questions', () => questions(socket));

  socket.on('vote', message => vote(socket, message));

  // Admin section
  socket.on('adminRefresh', () => authorizeAdmin(socket, adminRefresh));

  socket.on('adminQuestions', () => authorizeAdmin(socket, adminQuestions));

  socket.on('adminUsers', () => authorizeAdmin(socket, adminUsers));

  socket.on('adminAddQuestion', message =>
    authorizeAdmin(socket, adminAddQuestion, message)
  );
  socket.on('adminAddAnswer', message =>
    authorizeAdmin(socket, adminAddAnswer, message)
  );
  socket.on('adminAddUser', message =>
    authorizeAdmin(socket, adminAddUser, message)
  );
  socket.on('adminModifyUser', message =>
    authorizeAdmin(socket, adminModifyUser, message)
  );
  socket.on('adminSetUserPrivilage', message =>
    authorizeAdmin(socket, adminSetUserPrivilage, message)
  );
  socket.on('adminModifyAnswer', message =>
    authorizeAdmin(socket, adminModifyAnswer, message)
  );
  socket.on('adminModifyQuestion', message =>
    authorizeAdmin(socket, adminModifyQuestnion, message)
  );
  socket.on('adminSetQuestionShowAnswers', message =>
    authorizeAdmin(socket, adminSetQuestionShowAnswers, message)
  );
  socket.on('adminRemoveQuestion', message =>
    authorizeAdmin(socket, adminRemoveQuestion, message)
  );
  socket.on('adminRemoveAnswer', message =>
    authorizeAdmin(socket, adminRemoveAnswer, message)
  );
  socket.on('adminRemoveUser', message =>
    authorizeAdmin(socket, adminRemoveUser, message)
  );
});

server.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});
