const mongoose = require("..//services/mongoose").mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let PetModel = new Schema(
    {
        microchip: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        petName: {
            type: String,
            default: "",
            trim: true,
        },
        petSpecies: {
            type: String,
            default: "dog",
            trim: true,
        },
        petBreed: {
            type: String,
            default: "",
            trim: true,
        },
        petColor: {
            type: String,
            default: "",
            trim: true,
        },
        petGender: {
            type: String,
            default: "Male",
            trim: true,
        },
        petBirth: {
            type: String,
            default: "01/01/2001",
            trim: true,
        },
        specialNeeds: {
            type: String,
            default: "",
            trim: true,
        },
        vetInfo: {
            type: String,
            default: "",
            trim: true,
        },
        dateRV: {
            type: String,
            default: "",
            trim: true,
        },
        implantedCompany: {
            type: String,
            default: "",
            trim: true,
        },
        email: {
            type: String,
            default: "",
            trim: true,
        },
        ownerId: {
            type: String,
            default: "",
            trim: true,
        },
        photoPath: {
            type: String,
            default: "",
            trim: true,
        },
        ownerName: {
            type: String,
            default: "",
            trim: true,
        },
        membership: {
            type: String,
            default: "platinum",
            trim: true,
        },
        registered_at: {
            type: String,
            default: new Date(),
            trim: true,
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

PetModel.plugin(mongoosePaginate);
module.exports = mongoose.model("PetModel", PetModel);
