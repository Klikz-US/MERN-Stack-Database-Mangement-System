const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

let ownerSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        ownerName: {
            type: String,
            required: true
        },
        ownerPhone1: {
            type: String,
            required: true
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
            required: true
        },
        ownerAddress2: {
            type: String
        },
        ownerCity: {
            type: String,
            required: true
        },
        ownerState: {
            type: String,
            required: true
        },
        ownerZip: {
            type: String,
            required: true
        },
        ownerCountry: {
            type: String,
            required: true
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
            createdAt: 'create_at',
            updatedAt: 'updated_at'
        }
    }
);

ownerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('ownerSchema', ownerSchema);