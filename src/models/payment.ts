import mongoose from "mongoose";
import { PaymentStatus } from "../utils/enums";
import { contractSchema } from "./contract";

export const paymentSchema = new mongoose.Schema({
    dueDate: {
        type: Date,
        required: true,
    },
    expectedAmount: {
        type: Number,
        required: true,
    },
    outstandingAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: PaymentStatus,
        required: true
    },
    contract: {
        type: contractSchema,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})


export default mongoose.model("Payment", paymentSchema)