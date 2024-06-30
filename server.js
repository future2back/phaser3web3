// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
let stars = [];

// Função para adicionar uma estrela
function addStar(x, y) {
    stars.push({ x, y });
}

// Configuração do servidor Express
app.use(express.static('public'));

// Conectar ao Socket.IO
io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    players[socket.id] = { x: 100, y: 450, direction: 'turn' };

    socket.emit('updatePlayers', players);
    socket.emit('updateStars', stars);

    socket.on('playerMove', (data) => {
        players[socket.id] = { x: data.x, y: data.y, direction: data.direction };
        io.emit('updatePlayers', players);
    });

    socket.on('collectStar', (data) => {
        stars = stars.filter(star => star.x !== data.x || star.y !== data.y);
        io.emit('updateStars', stars);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
