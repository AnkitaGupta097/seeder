import mongoose from "mongoose";
import { CashkicksStatus } from "../utils/enums";
import { contractSchema } from "./contract";

export const cashkickSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: CashkicksStatus,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalFinanced: {
        type: Number,
        required: true
    },
    contracts: {
        type: [contractSchema],
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


export default mongoose.model("Cashkick", cashkickSchema)