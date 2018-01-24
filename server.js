const _ = require('lodash');

// HTTP Portion
const PORT = 8080;
const http = require('http');
// URL module
const url = require('url');
const path = require('path');

// Using the filesystem module
const fs = require('fs');
let prevData;

let server = http.createServer(handleRequest);
server.listen(PORT);

console.log('Server started on port ' + PORT);

function handleRequest(req, res) {
  // What did we request?
  let pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  let ext = path.extname(pathname);

  // Map extension to file type
  let typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  let contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


// WebSocket Portion
// WebSockets work with the HTTP server
const io = require('socket.io').listen(server);
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    socket.on('producer', function(data){
        if (!_.isEqual(data, prevData)) {
          prevData = data;
          io.emit(data.type, data);
        }
    });
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

