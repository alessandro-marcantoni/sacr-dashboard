module.exports = mongoose => {
  const airQualitySchema = mongoose.Schema({
    device: String,
    time: Date,
    concentration: Number,
  })
  return mongoose.model("AirQuality", airQualitySchema, "air_quality")
}
