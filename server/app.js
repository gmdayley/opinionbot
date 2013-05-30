var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  // , bot = require('./botController');


server.listen(3009);
console.log(__dirname);
app.use(express.static('www'));

var vtrs = [];

var voters = {
    length: 0
    },
    totals = {
        pos: 0,
        neg: 0
    },

    count = 0;

io.configure('development', function(){
    io.enable('browser client etag');
    io.set('log level', 1);

    io.set('transports', [
          'websocket'
        , 'flashsocket'
        , 'htmlfile'
        , 'xhr-polling'
        , 'jsonp-polling'
    ]);
});

io.sockets.on('connection', function (socket) {
    var clientId = socket.id;

    // Register voter
    var guid = generateGuid();
    socket.guid = guid;
    //voters[guid] = {socket: socket, vote:0};
    //voters.length++;


    vtrs[guid] = 0;

    console.log(vtrs);


    // Send ack of connection
    socket.emit('ack', { 
        message: 'You are connected.',
        id: guid
    });



    socket.on('vote', function(vote) {
        var prior = voters[socket.guid].vote;
        var pos = ((vote > 0)? vote : 0) - ((prior > 0)? prior : 0);
        var neg = ((vote < 0)? vote : 0) - ((prior < 0)? prior : 0);
        voters[socket.guid].vote = vote;
        totals.pos += pos;
        totals.neg += -neg;
        
        totals.cnt = voters.length;
        socket.broadcast.emit('score', totals);
        socket.emit('score', totals);

        // Go bots
        bot.scale(totals);
    });

    socket.on('actuate', function(scale) {
        // Go bots
        bot.scale(scale);
    });



    socket.on('v', function(vote) {
        vtrs[guid] = vote;
        var voteTotal = calculateVotes();

        console.log(voteTotal);

    });

});


var calculateVotes = function(){
    console.log('voters', vtrs);

    var total = 0;


    for(var guid in vtrs) {
        total += vtrs[guid];
    }

    return total;
}




var generateGuid = function() {
    var mask = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var guid = mask.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return guid;
}
