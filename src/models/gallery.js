var mongoose = require('mongoose')

var gallerySchema = new mongoose.Schema({
    title:String,
    galleryUrlsArray:{type:Array}
})

var galleryModel = mongoose.model('Gallery', gallerySchema)
module.exports = galleryModel