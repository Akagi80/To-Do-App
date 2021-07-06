const express = require('express');
const socket = require('socket.io');

const app = express();

// odpalamy server
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});
const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {

  // wysyłamy zdarzenie updateData tylko do jednego socketa
  io.to(socket.id).emit('updateData', tasks)
  console.log('New client! Its id – ' + socket.id);

  // Nasłuchiwacz na zdarzenie addTack dodające  dane - nazwę taska (taskName),
  io.on('addTask', (taskName) => {
    tasks.push(taskName);
    console.log('Add new task: ', taskName)
    // Serwer emituje powyzsze zdarzenie do wszystkich urzytkowników poza tym który je inicjował (broadcast)
    socket.broadcast.emit('addTask', taskName);
  });

  // Nasłuchiwacz na zdarzenie removeTack usuwające dane wskazane przez urzytkownika (deleteTask),
  io.on('removeTask', (deleteTask) => {
    tasks.splice(deleteTask, 1);
    console.log('Remove task id: ', deleteTask);
    socket.broadcast.emit('removeTask', deleteTask);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});


