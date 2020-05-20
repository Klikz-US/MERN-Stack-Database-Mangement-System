const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let petSchema = new Schema(
    {
        microchip: {
            type: String,
            index: true,
        },
        petName: {
            type: String,
            default: "",
        },
        petSpecies: {
            type: String,
            default: "dog",
        },
        petBreed: {
            type: String,
            default: "",
        },
        petColor: {
            type: String,
            default: "",
        },
        petGender: {
            type: String,
            default: "Male",
        },
        petBirth: {
            type: String,
            default: "01/01/2001",
        },
        specialNeeds: {
            type: String,
            default: "",
        },
        vetInfo: {
            type: String,
            default: "",
        },
        dateRV: {
            type: String,
            default: "",
        },
        implantedCompany: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
        ownerId: {
            type: String,
            default: "",
        },
        photoPath: {
            type: String,
            default: "",
        },
        ownerName: {
            type: String,
            default: "",
        },
        membership: {
            type: String,
            default: "platinum",
        },
        registered_at: {
            type: String,
            default: "01/01/2001",
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
