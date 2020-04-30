const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let petSchema = new Schema(
    {
        microchip: {
            type: String
        },
        petName: {
            type: String
        },
        petSpecies: {
            type: String
        },
        petBreed: {
            type: String
        },
        petColor: {
            type: String
        },
        petGender: {
            type: String
        },
        petBirth: {
            type: Date
        },
        specialNeeds: {
            type: String
        },
        vetInfo: {
            type: String
        },
        dateRV: {
            type: Date
        },
        implantedCompany: {
            type: String
        }
    }, 
    {
        collection: 'pets'
    }
);
module.exports = mongoose.model('petSchema', petSchema);