// Serwer Express dla platformy edukacyjnej (PL)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// HTTP server + Socket.IO
const server = http.createServer(app);
const initSockets = require('./sockets');
initSockets(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend uruchomiony na porcie ${PORT}`);
});
