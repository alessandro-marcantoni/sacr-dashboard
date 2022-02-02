require("dotenv").config()
const awsIoT = require("aws-iot-device-sdk")
const mongoose = require("mongoose")
const express = require("express")
const app = express()
const server = require("http").createServer(app)
const { Server } = require("socket.io")
const io = new Server(server,  {
  cors: {
    origins: "*"
  }
})
const cors = require("cors")

mongoose.connect(process.env.VC19_MONGODB_URL)
  .then(() => console.log("Connected to DB"))

const TempHumidity = require("./models/TempHumidity")(mongoose)
const AirQuality = require("./models/AirQuality")(mongoose)

io.on("connection", socket => {
  console.log("User connected to socket " + socket)
  io.on("disconnect", () => {
    console.log("User disconnected")
  })
})

const device = awsIoT.device({
  keyPath: "c6c7f9c1b8-private.pem.key",
  certPath: "c6c7f9c1b8-certificate.pem.crt",
  caPath: "AmazonRootCA1.pem",
  clientId: "sacr-dashboard-2",
  host: "a1agd712iaea4u-ats.iot.us-east-1.amazonaws.com",
})

device.on('connect', () => {
  console.log('Thing connected')
  device.subscribe("temperature_humidity")
  device.subscribe("air_quality")
})

device.on('message', (topic, payload) => {
  if (topic === "temperature_humidity") {
    const r = JSON.parse(payload.toString())
    const record = new TempHumidity(r)
    /*record.save((error, _error) => {
      if (error) console.error(error);
    })*/
    io.emit("tempHumidity", {
      time: r.time,
      temperature: r.temperature,
      humidity: r.humidity,
    })
  } else if (topic === "air_quality") {
    const r = JSON.parse(payload.toString())
    const record = new AirQuality(r)
    record.save((error, _error) => {
      if (error) console.error(error);
    })
    io.emit("airQuality", {
      time: r.time,
      concentration: r.concentration,
    })
  }
  console.log('message', topic, payload.toString());
})

const port = 3000

app.use(cors({
  origin: "*"
}))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.urlencoded({ extended: true }))

app.get("/temperatureHumidity", (_req, res) => {
  TempHumidity.find({}, (_error, result) => {
    res.json(result)
  })
})

app.get("/airQuality", (_req, res) => {
  AirQuality.find({}, (_error, result) => {
    res.json(result)
  })
})

server.listen(port, () => {
  console.log("Listening on port " + port)
})
