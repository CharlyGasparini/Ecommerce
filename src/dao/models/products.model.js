import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        code: {
            type: String,
            unique: true,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        owner: {
            type: String,
            default: "admin"
        },
        thumbnails: {
            type: Array,
            required: false
        }
    }
)

const productsModel = mongoose.model(productsCollection, productSchema);

export default productsModel;