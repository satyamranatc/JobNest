import applicationModel from "../models/application.model.js";
import { askAi } from "../utils/askAi.js";
import jobModel from "../models/job.model.js";
import userModel from "../models/user.model.js";
import { sendApplicationReceivedMail, sendApplicationStatusMail } from "../utils/emailUtlity.js";

// Apply for a job
export async function applyJob(req, res) {
    const candidateId = req.user?._id || req.user?.id;
    let { jobId, resume, hasPaid } = req.body;

    if (!jobId || !resume) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // If candidate has already applied for >= 2 jobs, payment is required
        const previousAppsCount = await applicationModel.countDocuments({ candidateId });
        if (previousAppsCount >= 2 && !hasPaid) {
            return res.status(402).json({
                message: "You have applied for 2 jobs. Please complete payment to apply for additional jobs.",
                requiresPayment: true,
                applicationCount: previousAppsCount
            });
        }

        let newApp = new applicationModel({
            candidateId,
            jobId,
            resume,
        });

        await newApp.save();

        let candidateData = await userModel.findOne({ _id: candidateId }).select("-password");
        let jobData = await jobModel.findOne({ _id: jobId }).populate("company", "name email avatar type");

        // Send email via Resend on application submission
        if (candidateData?.email) {
            sendApplicationReceivedMail({
                to: candidateData.email,
                candidateName: candidateData.name,
                jobTitle: jobData?.title,
                companyName: jobData?.company?.name
            }).catch(e => console.error("[Resend] Failed to send application received email:", e));
        }

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
        )
        .populate("candidateId", "name email")
        .populate({ path: "jobId", select: "title company", populate: { path: "company", select: "name" } });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Send Resend notification email if candidate passed (Selected) or rejected (Rejected)
        if (["Selected", "Rejected"].includes(status) && application.candidateId?.email) {
            sendApplicationStatusMail({
                to: application.candidateId.email,
                candidateName: application.candidateId.name,
                jobTitle: application.jobId?.title,
                companyName: application.jobId?.company?.name,
                status
            }).catch(e => console.error("[Resend] Failed to send status update email:", e));
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
