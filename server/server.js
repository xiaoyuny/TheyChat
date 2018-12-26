const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app')
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user connected')
  );

  socket.on('createMessage', message => {
    console.log('createMessage', message);
    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createAt: new Date().getTime()
    // });
    socket.broadcast.emit(
      'newMessage',
      generateMessage(message.from, message.text)
    );
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });
});

server.listen(3000, () => {
  console.log(`Server is up on ${port}`);
});
