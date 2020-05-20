const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let photoSchema = new Schema(
    {
        petMicrochip: {
            type: String,
            required: true,
            index: true,
        },
        petPhotoName: {
            type: String,
            default: "",
        },
        petPhotoData: {
            type: String,
            default: "",
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
module.exports = mongoose.model("photoSchema", photoSchema);
