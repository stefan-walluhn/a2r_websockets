var app = require('express').createServer(),
    io = require('socket.io').listen(7008) ;

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
    data[i][1] = Math.floor(Math.random()*256) ;
  }
  return data ;
}

app.set('view engine', 'jade') ;
app.set('view options', {layout: true}) ;

app.get('/', function(req, res) {
  res.render('index', {host: req.headers.host.split(':')[0]}) ;
  //res.sendfile(__dirname + '/index.html') ;
}) ;

app.listen(7007) ;

setInterval(function() {
  TestData = ReloadTestData(TestData) ;
  io.sockets.json.send(TestData) ;
}, 500) ;
