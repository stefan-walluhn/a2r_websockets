var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(7008),
    net = require('net') ;

// We need a shuffle method for arrays
Array.prototype.shuffle = function() {
  var s = [];
  while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
  while (s.length) this.push(s.pop());
  return this;
} 

// Some dummy test data
var TestData = new Array(8) ;
for (var i=0; i<TestData.length; i++) {
  TestData[i] = new Array(2) ;
}
var Frc = new Array(256) ;
for (var i=0; i<Frc.length; i++) {
  Frc[i] = i ;
}
 
// Load random value to dummy data
function ReloadTestData(data) {
  Frc.shuffle() ;
  for (var i=0; i<data.length; i++) {
    data[i][0] = Frc[i] ;
    data[i][1] = Math.floor(Math.random()*10) ;
  }
  return data ;
}

// little webserver for client html5 + javascript
app.set('view engine', 'jade') ;

app.use(express.static(__dirname + '/public')) ;

app.get('/', function(req, res) {
  res.render('index', {host: req.headers.host.split(':')[0]}) ;
  //res.sendfile(__dirname + '/index.html') ;
}) ;

app.listen(7007) ;

/* websocket server sending fft data
setInterval(function() {
  TestData = ReloadTestData(TestData) ;
  io.sockets.json.send(TestData) ;
}, 5000) ;
*/

// tcp server listening for fft data
var ffm_listener = net.createServer(function(socket) {
  console.log("new connection") ;
  socket.setEncoding('utf8') ;
  socket.on('data', function(data) {
    data = data.split('\;')[0].split('\\').join('') ; // TODO: check input!!!!
    try {
      data = JSON.parse(data) ; //TODO: fetch exception in a proper way
      // TODO: check input size
      io.sockets.json.send(data) ;
    } catch(e) {
    }
  }) ;
}) ;
ffm_listener.listen(7000) ;
