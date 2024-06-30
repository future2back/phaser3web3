const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.on('playerMove', (data) => {
        io.emit('updatePlayers', { [socket.id]: data });
    });

    socket.on('collectStar', (data) => {
        io.emit('updateStars', [data]);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        io.emit('updatePlayers', {});
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
