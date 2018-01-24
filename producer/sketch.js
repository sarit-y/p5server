var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DN02SKWC'; // fill in your serial port name here
var inDataX=50; // for incoming serial data
var inDataY=50; // for incoming serial data
var socket;
var prevInString;

function setup() {
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

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  var options = {
    baudrate: 9600
  }; // change the data rate to whatever you wish
  serial.open(portName, options);
  createCanvas(255, 255);

}

function draw() {
  background(0);
  fill(255);
  //  text("sensor value: " + inData, 30, 30);
  ellipse(inDataX, inDataY, 20, 20);
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  var inString = serial.readLine();
  // check to see that there's actually a string there:
  if (inString.length > 0) {
     if (inString != prevInString) {
      prevInString = inString;
      var splitString = split(inString, ',');
      if (splitString[0] === 'A') {
        // convert it to a number:
        var serialX = Number(splitString[1]);
        var serialY = Number(splitString[2]);
        console.log(serialX + ', ' + serialY);
        // send to server
        socket.emit('producer', {type: 'mouse', x: serialX, y: serialY});
      }
    }
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}


