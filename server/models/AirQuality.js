module.exports = mongoose => {
  const airQualitySchema = mongoose.Schema({
    device: String,
    time: Date,
    temperature: Number,
    humidity: Number,
  })
  return mongoose.model("AirQuality", airQualitySchema, "air_quality")
}