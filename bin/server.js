var http = require('http');
var app = require('../app');
const config = require('config');
var debug = require('debug')('backend:server');
const mongoClient = require('../mongo_models/base').mongoClient;
/**
 * Get port from environment and store in Express.
 */
var port = (config.has('port') ? config.get('port') : process.env.PORT || 3000);
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);


mongoClient().then((isConnected) => {
      /**
       * Listen on provided port, on all network interfaces.
       */
      server.listen(port, () => {
          debug('Express server listening to port ' + server.address().port)
      });
    }).catch(error => {
      console.log(error);
      process.exit(1);
});


server.on('error', onError);
server.on('listening', onListening);


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
