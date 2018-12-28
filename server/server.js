const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { decodeParams } = require('./utils/decodeParams');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    const name = decodeParams(params, 'name');
    const room = decodeParams(params, 'room');

    if (!isRealString(name) || !isRealString(room)) {
      return callback('Name and room name are required.');
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    // socket.leave(room);

    // io.emit - everyone connected -> io.to(room).emit
    // socket.broadcast.emit - everyone but the current user ->socket.broadcast.to(room).emit
    // socket.emit - specifially to one user -> socket.emit
    io.to(room).emit('updateUserList', users.getUserList(room));

    socket.emit(
      'newMessage',
      generateMessage(
        'Admin',
        `Hey ${name}, welcome to TheyChat! You're currently in room ${room}.`
      )
    );

    socket.broadcast
      .to(room)
      .emit('newMessage', generateMessage('Admin', `${name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        'newMessage',
        generateMessage(user.name, message.text)
      );
    }

    callback();
  });

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left the room.`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
