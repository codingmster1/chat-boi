const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    //welcomes current user
    socket.emit('message', 'Welcome to ChatBoi');

    // lets everyone, except for the user, aware someone connects
    socket.broadcast.emit('message', 'A wild user appeared!');

    // when someone disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'Oh no, user has left the chat!');
    })

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        console.log(msg)
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));