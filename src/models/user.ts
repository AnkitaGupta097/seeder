import mongoose from "mongoose";
import { UserRole, contractStatus } from "../utils/enums";
import { contractSchema } from "./contract";

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.RECIPIENT,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    contracts: {
        [UserRole.PROVIDER]: { type: [contractSchema], required: false },
        [UserRole.RECIPIENT]: { type: [{ contractDetail: { type: mongoose.Types.ObjectId, ref: "Contract" }, status: { type: String, enum: contractStatus, required: true, default: contractStatus.AVAILABLE }, startDate:{ type: Date}, payments: { type: [mongoose.Types.ObjectId], ref: "Payment" }, cashkick: {type: mongoose.Types.ObjectId, ref: "Cashkick" } }], required: false }
    }
})


export default mongoose.model("User", userSchema)