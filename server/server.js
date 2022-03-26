
////////////////////// COTE CLIENT //////////////////////////////

const http = require('http');
const app = require('./app');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});


const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);


////////////////////////// COTE BASE DE DONNEE ////////////////////////////////
//Je dois créer des routes et indiquer ce qu'elles renvoient (par exemple la liste des sportifs)

//Là j'arrive à récupérer des infos dans la base de données 

const sqlite3 = require('sqlite3');
var root = require('./roots.js');
 
// open the database
let db = new sqlite3.Database('./dataBase.db');
 
let sql = `SELECT * FROM sportif`;
 
// first row only
db.get(sql, (err, row) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(row);
  return row
 
});
 
// close the database connection
db.close();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/startingblock',root);
