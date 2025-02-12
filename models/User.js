import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
});

const answerSchema = new mongoose.Schema({
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});

const taskSchema = new mongoose.Schema({
    description: { type: String },
    picture: { type: String },
    type: {
        type: String,
        enum: ["open", "multiple", "single"],
        required: true,
    },
    openAnswer: { type: String },
    checkAnswer: [
        {
            answer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
});

const questSchema = new mongoose.Schema({
    picture: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    time: { type: String, default: "0" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // исправлено с taskIds на tasks
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    token: { type: String },
    rating: { type: Number, default: 0 },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    quests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
const Quest = mongoose.model("Quest", questSchema);
const Task = mongoose.model("Task", taskSchema);
const Answer = mongoose.model("Answer", answerSchema);
const History = mongoose.model("History", historySchema);

export { User, Quest, Task, Answer, History };
