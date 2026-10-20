import applicationModel from "../models/application.model.js";
import { askAi, askFeadBack } from "../utils/askAi.js";
import { sendApplicationStatusMail } from "../utils/emailUtlity.js";

export async function handleAsk(req, res) {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ message: "query is required in the request body" });
        }

        const aiResponse = await askAi(query.trim());
        const answer = aiResponse.choices?.[0]?.message?.content || "";

        return res.status(200).json({
            message: "AI response",
            answer,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export async function handleFeadback(req, res) {
    try {
        const { interviewQuestions, userAnswered, userAnswers } = req.body;
        const answers = userAnswered !== undefined ? userAnswered : userAnswers;

        if (!interviewQuestions || answers === undefined) {
            return res.status(400).json({
                message: "interviewQuestions and userAnswered are required in the request body"
            });
        }

        const aiResponse = await askFeadBack(interviewQuestions, answers);
        const rawContent = aiResponse.choices?.[0]?.message?.content || "";
        const cleaned = rawContent
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        let parsedAnswer;
        try {
            parsedAnswer = JSON.parse(cleaned);
        } catch {
            parsedAnswer = rawContent;
        }

        let overAllScore = 0;
        if (typeof parsedAnswer === "object" && parsedAnswer !== null) {
            overAllScore = Number(parsedAnswer.finalScore ?? parsedAnswer.scores?.finalScore ?? 0);
        }

        const newStatus = overAllScore >= 70 ? "Selected" : "Rejected";

        const appId = req.body.applicationId || req.body.id || req.params?.id;
        let updatedApplication = null;

        if (appId) {
            updatedApplication = await applicationModel.findByIdAndUpdate(
                appId,
                { status: newStatus },
                { new: true }
            );
        } else if (req.body.jobId && req.user?._id) {
            updatedApplication = await applicationModel.findOneAndUpdate(
                { jobId: req.body.jobId, candidateId: req.user._id },
                { status: newStatus },
                { sort: { createdAt: -1 }, new: true }
            );
        } else if (req.user?._id || req.user?.id) {
            const candidateId = req.user._id || req.user.id;
            updatedApplication = await applicationModel.findOneAndUpdate(
                { candidateId },
                { status: newStatus },
                { sort: { createdAt: -1 }, new: true }
            );
        }

        // Trigger Resend email when interview evaluation updates status (Selected/Passed or Rejected)
        if (updatedApplication?._id) {
            try {
                const populatedApp = await applicationModel.findById(updatedApplication._id)
                    .populate("candidateId", "name email")
                    .populate({ path: "jobId", select: "title company", populate: { path: "company", select: "name" } });

                if (populatedApp?.candidateId?.email) {
                    sendApplicationStatusMail({
                        to: populatedApp.candidateId.email,
                        candidateName: populatedApp.candidateId.name,
                        jobTitle: populatedApp.jobId?.title,
                        companyName: populatedApp.jobId?.company?.name,
                        status: newStatus
                    }).catch(e => console.error("[Resend] Failed sending feedback status email:", e));
                }
            } catch (errPopulate) {
                console.error("[Resend] Error populating application for feedback email:", errPopulate);
            }
        }

        return res.status(200).json({
            message: "AI Feedback",
            feedback: parsedAnswer,
            answer: parsedAnswer,
            status: newStatus,
            application: updatedApplication,
        });
    } catch (err) {
        console.error("Error in handleFeadback:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}