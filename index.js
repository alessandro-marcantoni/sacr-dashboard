const awsIoT = require("aws-iot-device-sdk")

const device = awsIoT.device({
  keyPath: "bc987f6281-private.pem.key",
  certPath: "bc987f6281-certificate.pem.crt",
  caPath: "AmazonRootCA1.pem",
  clientId: "sacr-dashboard",
  host: "a1agd712iaea4u-ats.iot.us-east-1.amazonaws.com",
})

device.on('connect', () => {
  console.log('Thing connected')
  device.subscribe("temperature_humidity")
})

device.on('message', (topic, payload) => {
  console.log('message', topic, payload.toString());
})