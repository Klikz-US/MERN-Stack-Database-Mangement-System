const mongoose = require("..//services/mongoose").mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let OwnerModel = new Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        ownerName: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone1: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone2: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone3: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone4: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone5: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone6: {
            type: String,
            default: "",
            trim: true,
        },
        ownerPhone7: {
            type: String,
            default: "",
            trim: true,
        },
        ownerAddress1: {
            type: String,
            default: "",
            trim: true,
        },
        ownerAddress2: {
            type: String,
            default: "",
            trim: true,
        },
        ownerCity: {
            type: String,
            default: "",
            trim: true,
        },
        ownerState: {
            type: String,
            default: "",
            trim: true,
        },
        ownerZip: {
            type: String,
            default: "",
            trim: true,
        },
        ownerCountry: {
            type: String,
            default: "US",
            trim: true,
        },
        ownerSecContact: {
            type: String,
            default: "",
            trim: true,
        },
        ownerNote: {
            type: String,
            default: "",
            trim: true,
        },
        registered_at: {
            type: String,
            default: new Date(),
            trim: true,
        },
    },
    {
        collection: "owners",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

OwnerModel.plugin(mongoosePaginate);
module.exports = mongoose.model("OwnerModel", OwnerModel);
