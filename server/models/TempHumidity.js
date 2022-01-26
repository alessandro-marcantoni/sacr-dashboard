module.exports = (mongoose) => {
  const tempHumiditySchema = mongoose.Schema({
    device: String,
    time: Date,
    temperature: Number,
    humidity: Number,
  })
  return mongoose.model("TempHumidity", tempHumiditySchema, "temperature_humidity")
}