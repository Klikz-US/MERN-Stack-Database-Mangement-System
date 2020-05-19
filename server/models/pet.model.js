const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let petSchema = new Schema(
    {
        microchip: {
            type: String,
            required: true,
            index: true,
        },
        petName: {
            type: String,
            required: true,
        },
        petSpecies: {
            type: String,
            required: true,
        },
        petBreed: {
            type: String,
            required: true,
        },
        petColor: {
            type: String,
            required: true,
        },
        petGender: {
            type: String,
            required: true,
        },
        petBirth: {
            type: Date,
            required: true,
        },
        specialNeeds: {
            type: String,
        },
        vetInfo: {
            type: String,
        },
        dateRV: {
            type: Date,
        },
        implantedCompany: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        ownerId: {
            type: String,
        },
        photoPath: {
            type: String,
        },
        ownerName: {
            type: String,
        },
        membership: {
            type: String,
            default: "platinum",
            required: true,
        },
        registered_at: {
            type: String,
            default: new Date(),
        },
    },
    {
        collection: "pets",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

petSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("petSchema", petSchema);
