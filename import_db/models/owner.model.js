const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

let ownerSchema = new Schema(
    {
        email: {
            type: String,
        },
        ownerName: {
            type: String,
        },
        ownerPhone1: {
            type: String,
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
            type: String,
        },
        ownerAddress2: {
            type: String
        },
        ownerCity: {
            type: String,
        },
        ownerState: {
            type: String,
        },
        ownerZip: {
            type: String,
        },
        ownerCountry: {
            type: String,
        },
        ownerSecContact: {
            type: String
        },
        ownerNote: {
            type: String
        }
    },
    {
        collection: 'owners',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

ownerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('ownerSchema', ownerSchema);