const socket = io();

socket.on('connect', function() {
  console.log('Connected to server.');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function(message) {
  const list = document.getElementById('messages');
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(`${message.from}: ${message.text}`));
  list.appendChild(li);
});

// socket.emit(
//   'createMessage',
//   {
//     from: 'Frank',
//     text: 'Hi'
//   },
//   function(message) {
//     console.log(message);
//   }
// );

document.getElementById('message-form').addEventListener('submit', function(e) {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: document.getElementsByTagName('input')[0].value
    },
    function(message) {
      console.log(message);
      document.getElementsByTagName('input')[0].value = '';
    }
  );
});
