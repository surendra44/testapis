var mongoose = require('mongoose')

var memberSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: {
        type: String, unique: true, validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // regex to match 10 digit mobile number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
        required: [true, 'Mobile number is required']
    },
    email: { type: String, unique: true },
    address: {type: String},
    designation: {type: String},
    gender:{type: String},
    remarks: { type: String },
})

var memberModel = mongoose.model('Members', memberSchema)
module.exports = memberModel