var mongoose = require('mongoose');
mongoose.set('debug', true);

var CustomerSchema = new mongoose.Schema({
    SerialNo: {type: String, required: true},
    Name: String,
    email: {type: String, required: true},
    PhoneNumber: String,
    ImageLink: String,
    Title: String
    

});

module.exports = mongoose.model('customers', CustomerSchema);
