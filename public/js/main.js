const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


// fetch username and room from url 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

//join chatroom 
socket.emit('joinRoom', { username, room });


// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scrolls down with new message present
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit('chatMessage', msg);

    //clears input after message is sent
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}