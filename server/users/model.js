const mongoose = require("..//services/mongoose").mongoose;
const Schema = mongoose.Schema;

const UserModel = new Schema(
    {
        role: {
            type: String,
            default: "vet",
            required: true,
            trim: true,
        },
        email: {
            type: String,
            default: "",
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
        },
        password: {
            type: String,
            default: "",
            required: true,
            trim: true,
        },
        name: {
            type: String,
            default: "",
            required: true,
            trim: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        collection: "users",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("UserModel", UserModel);
