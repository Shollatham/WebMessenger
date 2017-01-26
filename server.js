var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var chatService = require('./server/chatService');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('ChatDB');
// db.serialize(function () {
var getTableStmt = 'SELECT name FROM sqlite_master WHERE type="table" AND name="message_history";';
db.get(getTableStmt, function (err, row) {
  if (err != null) {
    console.log('err: ' + err);
  } else {
    if (row == null) {
      db.run('CREATE TABLE message_history (' +
      'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
      'name TEXT,' +
      'message TEXT)');
    }
  }
});
db.close();
// });

var port = 3000;

// dev

app.use('/dev/third-party', express.static(path.join(__dirname, '/web/third-party')));
app.use('/dev', express.static(path.join(__dirname, '/web/src')));
app.get('/dev', function (req, res) {
  res.sendFile(path.join(__dirname, '/web/src/index.html'));
});

// prod

app.use(express.static(path.join(__dirname, '/web/dist')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/web/dist/index.html'));
});

chatService.chatService(io);

app.get('/getHistory', chatService.getHistory);
app.post('/test', function (req, res) {
  res.send('test Shoney');
});

http.listen(port, function () {
  console.log('listening on port ' + port);
});
