const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Microchip = new Schema({
    microchip_Number: {
        type: String
    },
    owner_Email: {
        type: String
    }
});
module.exports = mongoose.model('Microchip', Microchip);