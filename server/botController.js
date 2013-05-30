var five = require("johnny-five"),
   board = new five.Board();

var servo;
board.on("ready", function() {
  servo = new five.Servo({
    pin: "O5"
  });
});

module.exports = {
  scale: function(value) {
    if (servo) {
      servo.cw(value);
    }
  }
};