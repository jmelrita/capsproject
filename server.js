// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const userSockets = {};
const spaSockets = {};

// Define event handlers for socket connections
io.on('connection', (socket) => {
  console.log('A client has connected');


  socket.on('myId', (userId) => {
    console.log(userId);
    userSockets[userId] = socket.id;
  });
  socket.on('spaId', (spaId) => {
    console.log(spaId);
    spaSockets[spaId] = socket.id;
  });

  console.log(socket.id);
  // Listen for 'message' event from clients
  socket.on('book request', (data) => {
    console.log('book request:', data);
    const { spaId, message, userId } = data;
    const targetSocketId = spaSockets[spaId];
    // Broadcast the received message to all connected clients except the sender
    if (targetSocketId) {
      io.to(targetSocketId).emit('book request', message);
    } else {
      console.log(`User with spaId ${spaId} is not connected.`);
    }
  });
  socket.on('book accepted', (data1) => {
    console.log('book accepted:', data1);
    const { userId, message, spaId } = data1;
    const targetSocketId = userSockets[userId];
    if (targetSocketId) {
      io.to(targetSocketId).emit('book accepted', message);
    } else {
      console.log(`User with userId ${userId} is not connected.`);
    }
  });
  socket.on('therapist update', (data) => {
    console.log('therapist update:', data);
    const { userId, message, spaId } = data;
    //const targetSocketId = userSockets[userId];
    
      io.emit('therapist update', message);
    
  });

  socket.on('spa update', (data) => {
    console.log('spa update:', data);
    const { userId, message, spaId } = data;
    //const targetSocketId = userSockets[userId];
    
      io.emit('spa update', message);
    
  });
  socket.on('user update', (data) => {
    console.log('user update:', data);
    const { userId, message, spaId } = data;
    //const targetSocketId = userSockets[userId];
    
      io.emit('user update', message);
    
  });
  socket.on('spa activated', (data) => {
    console.log('spa actviated:', data);
    const { userId, message, spaId } = data;
    //const targetSocketId = userSockets[userId];
    
      io.emit('spa activated', message);
    
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove disconnected user's socket ID from the mapping
    const userId = Object.keys(userSockets).find(key => userSockets[key] === socket.id);
    if (userId) {
      delete userSockets[userId];
    }
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
