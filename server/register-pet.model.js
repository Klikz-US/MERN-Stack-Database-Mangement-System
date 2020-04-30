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
        },
        email: {
            type: String
        },
        ownerName: {
            type: String
        },
        ownerPhone1: {
            type: String
        },
        ownerPhone2: {
            type: String
        },
        ownerPhone3: {
            type: String
        },
        ownerPhone4: {
            type: String
        },
        ownerPhone5: {
            type: String
        },
        ownerPhone6: {
            type: String
        },
        ownerPhone7: {
            type: String
        },
        ownerAddress1: {
            type: String
        },
        ownerAddress2: {
            type: String
        },
        ownerCity: {
            type: String
        },
        ownerState: {
            type: String
        },
        ownerZip: {
            type: String
        },
        ownerCountry: {
            type: String
        },
        ownerSecContact: {
            type: String
        },
        ownerNote: {
            type: String
        }
    }, 
    {
        collection: 'pets'
    }
);
module.exports = mongoose.model('petSchema', petSchema);