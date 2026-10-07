import mongoose from "mongoose";


let applicationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Selected", "Rejected"],
        required: true
    }
},{
    timestamps: true
});

export default mongoose.model("Application", applicationSchema);