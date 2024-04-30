import mongoose from "mongoose";
import { contractType } from "../utils/enums";

export const contractSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: contractType,
        default: contractType.MONTHLY,
        required: true
    },
    termLength: {
        type: Number,
        required: true
    },
    termRate: {
        type: Number,
        required: true
    },
    perPayment: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    totalAmount: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
    totalFinanced: {
        type: mongoose.Types.Decimal128,
        required: true,
    }
}, {
    timestamps: true
})


export default mongoose.model("Contract", contractSchema)