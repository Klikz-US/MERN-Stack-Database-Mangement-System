const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Pet = new Schema({
    microchip_number: {
        type: String
    },
    owner_email: {
        type: String
    }
}, {
    collection: 'pets'
});
module.exports = mongoose.model('Pet', Pet);