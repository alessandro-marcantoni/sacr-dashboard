require("dotenv").config()
const awsIoT = require("aws-iot-device-sdk")
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")

mongoose.connect(process.env.VC19_MONGODB_URL)
  .then(() => console.log("Connected to DB"))

const TempHumidity = require("./models/TempHumidity")(mongoose)
const AirQuality = require("./models/AirQuality")(mongoose)

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
  if (topic === "temperature_humidity") {
    const record = new TempHumidity(JSON.parse(payload.toString()))
    /*record.save((error, _error) => {
      if (error) console.error(error);
    })*/
  }
  console.log('message', topic, payload.toString());
})

const app = express()
const port = 3000

app.use(cors({
  origin: "*"
}))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.urlencoded({ extended: true }))

app.get("/temperatureHumidity", (_req, res) => {
  TempHumidity.find({}, (_error, result) => {
    res.send(result)
  })
})

app.listen(port, () => {
  console.log("Listening on port " + port)
})