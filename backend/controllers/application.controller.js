import applicationModel from "../models/application.model.js";
import { askAi } from "../utils/askAi.js";
import jobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";

// Apply for a job
export async function applyJob(req, res) {
    const candidateId = req.user?._id || req.user?.id;
    let { jobId, resume } = req.body;

    if (!jobId || !resume) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let newApp = new applicationModel({
            candidateId,
            jobId,
            resume,
        });

        await newApp.save();

        let candidateData = await userModel.findOne({ _id: candidateId }).select("-password");
        let jobData = await jobModel.findOne({ _id: jobId }).populate("company", "name email avatar type");

        let interviewSet = null;
        try {
            const aiResponse = await askAi(jobData, candidateData);
            const rawContent = aiResponse.choices?.[0]?.message?.content || "";
            try {
                interviewSet = JSON.parse(rawContent);
            } catch {
                interviewSet = rawContent;
            }
        } catch (aiErr) {
            console.error("AI interview generation error:", aiErr);
            interviewSet = null;
        }

        return res.status(201).json({
            message: "Job applied successfully",
            application: newApp,
            interviewSet: interviewSet
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}



// Check status of a single application by ID
export async function getApplicationStatus(req, res) {
    try {
        const { id } = req.params;
        const application = await applicationModel.findById(id)
            .populate("jobId", "title location type salary")
            .populate("candidateId", "name email");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.status(200).json({
            success: true,
            status: application.status,
            application
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get all applications for current candidate
export async function getUserApplications(req, res) {
    try {
        const candidateId = req.user._id || req.user.id;
        const applications = await applicationModel.find({ candidateId })
            .populate({
                path: "jobId",
                select: "title location company type salary thumbnail",
                populate: { path: "company", select: "name avatar email" }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update application status (Company only: Applied | Selected | Rejected)
export async function updateApplicationStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Applied", "Selected", "Rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            });
        }

        const application = await applicationModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.status(200).json({
            message: "Application status updated successfully",
            status: application.status,
            application
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

