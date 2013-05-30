var five = require("johnny-five"),
   board = new five.Board(),
   led = new five.Led('O5');


var servo;
board.on("ready", function() {
  servo = new five.Servo({
    pin: "O5",
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
  },

  stobeLed: function(value) {
  	led.strobe(value);
  }
};