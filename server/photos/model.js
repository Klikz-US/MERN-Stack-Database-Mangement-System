const mongoose = require("..//services/mongoose").mongoose;
const Schema = mongoose.Schema;

let PhotoModel = new Schema(
    {
        petMicrochip: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        petPhotoName: {
            type: String,
            default: "",
            trim: true,
        },
        petPhotoData: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        collection: "photos",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);
module.exports = mongoose.model("PhotoModel", PhotoModel);
