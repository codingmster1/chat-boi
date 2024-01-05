const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBoi Bot';

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);



        socket.join(user.room);


        //welcomes current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatBoi'));

        // lets everyone, except for the user, aware someone connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `A wild ${user.username} appeared!`)
            );
    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    })
    // when someone disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'Oh no, user has left the chat!'));
    })
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));