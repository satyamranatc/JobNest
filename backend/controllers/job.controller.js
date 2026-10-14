import JobModel from "../models/job.model.js";
import "../models/user.model.js";

// Get all jobs with optional keyword / filter support
export async function getAllJobs(req, res) {
    try {
        const { keyword, location, type, workMode } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (type) {
            query.type = type;
        }

        if (workMode) {
            query.workMode = workMode;
        }

        const jobs = await JobModel.find(query)
            .populate("company", "name email avatar type")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (err) {
        console.error("Error in getAllJobs:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get single job details by ID
export async function getJobById(req, res) {
    try {
        const { id } = req.params;
        const job = await JobModel.findById(id).populate("company", "name email avatar type");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job
        });
    } catch (err) {
        console.error("Error in getJobById:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Create a new job posting (Company only)
export async function createJob(req, res) {
    try {
        const { title, description, location, salary, type, workMode, thumbnail } = req.body;

        if (!title || !description || !location || !salary || !type || !workMode) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const jobData = {
            title,
            description,
            location,
            salary,
            type,
            workMode,
            company: req.user._id
        };

        if (thumbnail) {
            jobData.thumbnail = thumbnail;
        }

        const job = await JobModel.create(jobData);

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    } catch (err) {
        console.error("Error in createJob:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
}

// Backward compatibility alias
export const getJobs = getAllJobs;
