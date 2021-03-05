const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
// Get user and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
const socket = io();

// Join room
socket.emit('joinRoom', { username, room });
// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

// Out put message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `; 
    document.querySelector('.chat-messages').appendChild(div)
}