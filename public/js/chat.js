const socket = io();

function scrollToBottom() {
  // selectors
  const messages = document.getElementById('messages');
  const newMessage = messages.lastChild;
  // heights
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  const newMessageHeight = newMessage.offsetHeight;
  let lastMessageHeight = 0;

  if (newMessage.previousSibling) {
    lastMessageHeight = newMessage.previousSibling.offsetHeight;
  }

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTo(
      0,
      document.body.scrollHeight || document.documentElement.scrollHeight
    );
  }
}

socket.on('connect', function() {
  console.log('Connected to server.');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('hh:mm a');
  const list = document.getElementById('messages');
  const li = document.createElement('li');

  const from = document.createElement('p');
  from.appendChild(document.createTextNode(`${message.from}`));
  from.classList.add('display-inline');
  from.classList.add('user-name');

  const time = document.createElement('p');
  time.appendChild(document.createTextNode(`${formattedTime}`));
  time.classList.add('display-inline');
  time.classList.add('timestamp');

  const content = document.createElement('p');
  content.appendChild(document.createTextNode(`${message.text}`));
  content.classList.add('content');

  li.appendChild(from);
  li.appendChild(time);
  li.appendChild(document.createElement('br'));
  li.appendChild(content);
  list.appendChild(li);

  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('hh:mm a');
  const list = document.getElementById('messages');
  const a = document.createElement('a');
  const li = document.createElement('li');
  const p = document.createElement('p');

  const from = document.createElement('p');
  from.appendChild(document.createTextNode(`${message.from}`));
  from.classList.add('display-inline');
  from.classList.add('user-name');

  const time = document.createElement('p');
  time.appendChild(document.createTextNode(`${formattedTime}`));
  time.classList.add('display-inline');
  time.classList.add('timestamp');

  a.appendChild(document.createTextNode('My current location'));
  li.appendChild(from);
  li.appendChild(time);
  li.appendChild(document.createElement('br'));
  a.setAttribute('href', message.url);
  a.setAttribute('target', '_blank');
  p.classList.add('content');
  p.appendChild(a);
  li.appendChild(p);
  list.appendChild(li);

  scrollToBottom();
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
