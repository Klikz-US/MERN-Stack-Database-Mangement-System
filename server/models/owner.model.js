const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let ownerSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
        },
        ownerName: {
            type: String,
            default: "",
        },
        ownerPhone1: {
            type: String,
            default: "",
        },
        ownerPhone2: {
            type: String,
            default: "",
        },
        ownerPhone3: {
            type: String,
            default: "",
        },
        ownerPhone4: {
            type: String,
            default: "",
        },
        ownerPhone5: {
            type: String,
            default: "",
        },
        ownerPhone6: {
            type: String,
            default: "",
        },
        ownerPhone7: {
            type: String,
            default: "",
        },
        ownerAddress1: {
            type: String,
            default: "",
        },
        ownerAddress2: {
            type: String,
            default: "",
        },
        ownerCity: {
            type: String,
            default: "",
        },
        ownerState: {
            type: String,
            default: "",
        },
        ownerZip: {
            type: String,
            default: "",
        },
        ownerCountry: {
            type: String,
            default: "US",
        },
        ownerSecContact: {
            type: String,
            default: "",
        },
        ownerNote: {
            type: String,
            default: "",
        },
        registered_at: {
            type: String,
            default: "01/01/2001",
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

ownerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ownerSchema", ownerSchema);
