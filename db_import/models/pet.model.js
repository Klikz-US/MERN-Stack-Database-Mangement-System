const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let petImportSchema = new Schema(
    {
        microchip: {
            type: String,
        },
        petName: {
            type: String,
        },
        petSpecies: {
            type: String,
            default: 'dog'
        },
        petBreed: {
            type: String,
            default: ''
        },
        petColor: {
            type: String,
            default: ''
        },
        petGender: {
            type: String,
            default: 'Male'
        },
        petBirth: {
            type: Date,
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
            type: String,
        },
        membership: {
            type: String,
            default: "platinum",
        }
    },
    {
        collection: 'pets',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('petImportSchema', petImportSchema);