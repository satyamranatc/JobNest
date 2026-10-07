import mongoose from "mongoose"

let jobSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum:["Full Time", "Part Time", "Internship"],
        required: true,
        trim: true
    },
    workMode: {
        type: String,
        enum:["Work From Home", "On Site"],
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        default:"https://img.magnific.com/premium-vector/search-job-find-vacancy-employment-go-career-people-seek-vacancy-search-new-work-internet_352905-871.jpg?semt=ais_hybrid&w=740&q=80",
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

},{
    timestamps: true
});

jobSchema.index({title: "text", description: "text"});

export default mongoose.model("Job", jobSchema);