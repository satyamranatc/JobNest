import express from "express"
import "dotenv/config"
import cors from "cors"
import dbConfig from "./config/db.js"

import authRoutes from "./routes/auth.routes.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"


const app = express();
app.use(express.json())
app.use(cors())

dbConfig();



// Health & Status check endpoints
app.get("/status", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy and running", uptime: process.uptime() });
});
app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", message: "JobNest API is running" });
});

app.use("/auth", authRoutes);
app.use("/job", jobRoutes);
app.use("/application", applicationRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

