var mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
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
    password: { type: String, unique: true },
    remarks: { type: String },
})

var adminModel = mongoose.model('Admin', adminSchema)
module.exports = adminModel