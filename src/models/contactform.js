var mongoose = require('mongoose')

var contactSchema = new mongoose.Schema({
    fullName: String,
    phoneNum: {
        type: Number, unique: true, validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // regex to match 10 digit mobile number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
        required: [true, 'Mobile number is required']
    },
    message: String
})

var contactModel = mongoose.model('ContactForm', contactSchema)
module.exports = contactModel