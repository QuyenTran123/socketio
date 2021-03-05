const path = require('path');
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/utils/messages');
const { userJoin, getCurrentUser, getRoomUsers, userLeave } = require('./public/utils/users');

 const app = express();
 const server = http.createServer(app);
 const io = socketio(server);

 const botName  = 'ChatCord Bot';
 // Set static folder
 app.use(express.static(path.join(__dirname, 'public')));

 // Run when client connects
 io.on('connection', socket => {
     socket.on('joinRoom', ( { username, room } )=> {
        console.log('New WS connection...');
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
      //   socket.join(user.username);
        // Welcome current user
        socket.emit('message', formatMessage(botName ,'Welcome to ChatCord!'));
   
       // Boardcast when user connect
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName ,`${user.username} has joined the chat`));
   
     });
   
    // Listen for chatMessage
      socket.on('chatMessage', msg => {
         const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(`${user.username}`, msg));
    });

     // Run when client disconnect
     socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
        if (user) {
         io.to(user.room)
         .emit(
            'message', 
            formatMessage(botName,`${user.username} has left the chat`));
        }
        
     });

    
 })
 const PORT = 3000 || process.env.PORT
 server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 