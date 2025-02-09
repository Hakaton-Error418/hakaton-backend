import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const historyItemSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
});

const questItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
});

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "",
        },
        token: { type: String },
        rating: {
            type: Number,
            default: 0,
        },
        history: [historyItemSchema],
        quests: [questItemSchema],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
