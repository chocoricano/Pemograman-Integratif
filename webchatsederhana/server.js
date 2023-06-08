const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const port = 3000
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

 app.use(express.static('public'))

 const botName = 'Node Fuse' 


// akan berjalan saat user terkoneksi
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room )
    
        socket.join(user.room)


    // pesan selamat datang 
    socket.emit('message', formatMessage(botName,'Selamat datang di NodeFuse'))

    // pesan broadcast ketika user terkoneksi
    
socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    // ambil pesan dari chatMessage
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    
    // pesan saat terputus koneksi
    socket.on('disconnect', () => {

        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
        
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
            
        }
    })
})


app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Port server adalah ${port}`))
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const path = require('path');
// const formatMessage = require('./utils/message');
// const {userJoin,getCurrentUser} = require('./utils/users');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
// const PORT = process.env.PORT || 3000;
// const botName = 'ChatCord Bot';

// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Run when client connects
// io.on('connection', (socket) => {
//   const user = userJoin(socket.id, username, room )
    
//         socket.join(user.room)
//   socket.on('joinRoom', ({ username, room }) => {
//     // Welcome current user
//   socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

//   // Broadcast when a user connects
//   socket.broadcast.to(user.room)
//   emit('message', formatMessage(botName,`${user.username} has joined the chat` ));
 
//      });
  

//   // Listen for chatMessage
//   socket.on('chatMessage', (msg) => {
//     const user = getCurrentUser(socket.id)
//     io.to(user.room).emit('message', formatMessage(user.username, msg));
//   });

//   // Runs when client disconnects
//   socket.on('disconnect', () => {

//     const user = userLeave(socket.id);

//     if (user) {
//       io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
  
//       io.to(user.room).emit('roomUsers', {
//           room: user.room,
//           users: getRoomUsers(user.room)
//       });
      
//     };
//    });
// });

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

