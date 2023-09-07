import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            required: true
        },
        purchase_datetime: {
            type: Date,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        purchaser: {
            type: String,
            required: true
        }
    }
)

const ticketsModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketsModel;