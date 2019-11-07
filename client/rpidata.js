const axios = require("axios");
const linuxduino = require("linuxduino");

// Server URL
const server = axios.create({
  baseURL: `http://192.168.139.1:8088/`
});

// Get message
server
  .get("rpihello")
  .then(response => {
    // Should return a link
    if (response.status != 200) {
      console.error("Server error at rpimsg");
    } else {
      console.log(response.data);
    }
  })
  .catch(error => console.error(error.errno)); // if network error

// Test digitalRead
(async () => {
  // Wait for wasm file
  await linuxduino.ready;

  var ledPin = 17; // Embedded board GPIO Number
  var input = 0;
  linuxduino.pinMode(ledPin, linuxduino.INPUT);
  while (1) {
    input = linuxduino.digitalRead(ledPin);
    if (input == 1) {
      await sendButtonPress();
    }
    console.log(input);
    linuxduino.delay(500);
  }
  return 0;
})();

async function sendButtonPress() {
  // Send Message
  await server
    .post("rpimsg", {
      rpimsg: "Push button ON"
    })
    .then(response => {
      // Should return a link
      if (response.status != 200) {
        console.error("Server error at rpimsg");
      } else {
        console.log(response.data);
      }
    })
    .catch(error => {
      console.error(error.errno);
    }); // if network error
}
