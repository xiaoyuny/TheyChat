const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { decodeParams } = require('./utils/decodeParams');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    const name = decodeParams(params, 'name');
    const room = decodeParams(params, 'room');

    if (!isRealString(name) || !isRealString(room)) {
      callback('Name and room name are required.');
    }

    socket.join(room);
    // socket.leave(room);

    // io.emit - everyone connected -> io.to(room).emit
    // socket.broadcast.emit - everyone but the current user ->socket.broadcast.to(room).emit
    // socket.emit - specifially to one user -> socket.emit

    socket.emit(
      'newMessage',
      generateMessage('Admin', `Hey ${name}, Welcome to the chat app`)
    );

    socket.broadcast
      .to(room)
      .emit('newMessage', generateMessage('Admin', `${name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });
});

server.listen(3000, () => {
  console.log(`Server is up on ${port}`);
});
