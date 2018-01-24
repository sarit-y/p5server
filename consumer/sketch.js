var inDataX=50; // for incoming serial data
var inDataY=50; // for incoming serial data
var socket;


function setup() {
  createCanvas(255, 255);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect();
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      inDataX = data.x;
      inDataY = data.y;
    }
  );
}

function draw() {
  background(0);
  fill(255);
  ellipse(inDataX, inDataY, 20, 20);
}


