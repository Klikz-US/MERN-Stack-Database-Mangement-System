const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let photoSchema = new Schema(
    {
        petMicrochip: {
            type: String,
            required: true
        },
        petPhotoName: {
            type: String,
            required: true
        },
        petPhotoData: {
            type: String,
            required: true
        }
    },
    {
        collection: 'photos',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);
module.exports = mongoose.model('photoSchema', photoSchema);