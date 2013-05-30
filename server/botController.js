var five = require("johnny-five"),
   board = new five.Board();

var servo;
board.on("ready", function() {
  servo = new five.Servo({
    pin: "O5"
    range: [ 0, 180 ],
    type: "standard",
    startAt: 90,
    center: true
  });
});

module.exports = {
  scale: function(value) {
    if (servo) {
      servo.move(value);
    }
  }
};