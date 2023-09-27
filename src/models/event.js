var mongoose = require('mongoose')

var eventSchema = new mongoose.Schema({
    title:String,
    description:String,
    photoUrl:String
})

var eventModel = mongoose.model('Event', eventSchema)
module.exports = eventModel