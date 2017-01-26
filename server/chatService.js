var sqlite3 = require('sqlite3').verbose();

module.exports = {
  'chatService': function (io) {
    io.on('connection', function (socket) {
      console.log('a user connected');
      socket.on('send_message', function (msgObj) {
        console.log('name: ' + msgObj.name + ', message: ' + msgObj.message);
        var db = new sqlite3.Database('ChatDB');
        var insertStmt = 'insert into message_history (name, message) values ("' + msgObj.name + '", "' + msgObj.message + '")';
        db.run(insertStmt);
        db.close();
        io.emit('receive_message', msgObj);
      });
      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });
  },
  'getHistory': function (req, res) {
    var db = new sqlite3.Database('ChatDB');
    db.all('select name, message from (select id, name, message from message_history order by id desc limit 100) temp order by id', function (err, rows) {
      if (err != null) {
        console.log(err);
      } else {
        res.send(rows);
      }
    });
    db.close();
  }
};
