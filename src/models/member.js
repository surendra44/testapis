var mongoose = require('mongoose')

var memberSchema = new mongoose.Schema({
    memberName: { type: String, required: true },
    phoneNum: {
        type: Number, unique: true, validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // regex to match 10 digit mobile number
            },
            message: props => `${props.value} is not a valid mobile number!`
        },
        required: [true, 'Mobile number is required']
    },
    email: { type: String },
    address: { type: String },
    designation: { type: String, default: 'Member' },
    uniqueId: { type: String, unique: true },
    fatherName: { type: String },
    relation: { type: String },
    aadharNum: { type: Number },
    validity: {
        type: Date,
    },
    photoUrl: { type: String },
    gender: { type: String },
    remarks: { type: String },
    isApproved: { type: Boolean, default: false }
})

var memberModel = mongoose.model('Members', memberSchema)
module.exports = memberModel