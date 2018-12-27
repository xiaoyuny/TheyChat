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

socket.on('newLocationMessage', function(message) {
  const list = document.getElementById('messages');
  const a = document.createElement('a');
  const li = document.createElement('li');

  a.appendChild(document.createTextNode('My current location'));
  li.appendChild(document.createTextNode(`${message.from}: `));
  a.setAttribute('href', message.url);
  a.setAttribute('target', '_blank');
  li.appendChild(a);
  list.appendChild(li);
});

document.getElementById('message-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const messageTextbox = document.getElementsByTagName('input')[0];

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.value
    },
    function(message) {
      console.log(message);
      messageTextbox.value = '';
    }
  );
});

const locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not suppoerted by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerText = 'Sending location...';

  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.removeAttribute('disabled');
      locationButton.innerText = 'Send Location';
    },
    function() {
      alert('Unable to fetch location');
      locationButton.removeAttribute('disabled');
      locationButton.innerText = 'Send Location';
    }
  );
});
