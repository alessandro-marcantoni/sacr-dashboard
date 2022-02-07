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
const Room = require("./models/Room")(mongoose)

const handleTemperatureHumidity = (payload) => {
  const record = new TempHumidity(payload)
  record.save((error, _) => {
    if (error) console.error(error);
  })
  io.emit("tempHumidity", {
    device: payload.device,
    time: payload.time,
    temperature: payload.temperature,
    humidity: payload.humidity,
  })
}

const handleAirQuality = (payload) => {
  const record = new AirQuality(payload)
  record.save((error, _) => {
    if (error) console.error(error);
  })
  io.emit("airQuality", {
    device: payload.device,
    time: payload.time,
    concentration: payload.concentration,
  })
}

const actions = {
  "temperature_humidity": handleTemperatureHumidity,
  "air_quality": handleAirQuality
}

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
  device.subscribe("+/temperature_humidity")
  device.subscribe("+/air_quality")
})

device.on('message', (topic, payload) => {
  actions[`${Object.keys(actions).find(k => topic.includes(k))}`](JSON.parse(payload.toString()))
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

app.get("/rooms", (_req, res) => {
  Room.find({}, (_error, result) => {
    res.json(result)
  })
})

server.listen(port, () => {
  console.log("Listening on port " + port)
})
