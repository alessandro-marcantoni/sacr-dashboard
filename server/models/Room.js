module.exports = mongoose => {
    const roomSchema = mongoose.Schema({
        room: String,
        device: String,
    })
    return mongoose.model("Room", roomSchema, "rooms")
}
