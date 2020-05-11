const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        role: {
            type: String,
            default: 'vet',
            required: true
        },
        email: {
            type: String,
            default: '',
            required: true
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
            default: '',
            required: true
        },
        name: {
            type: String,
            default: '',
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        collection: 'users',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);
module.exports = mongoose.model('userSchema', userSchema);