import express from "express"
import "dotenv/config"
import cors from "cors"
import crypto from "crypto"
import dbConfig from "./config/db.js"
import Razorpay from "razorpay";

import authRoutes from "./routes/auth.routes.js"
import jobRoutes from "./routes/job.route.js"
import applicationRoutes from "./routes/application.route.js"




const app = express();
app.use(express.json())
app.use(cors())

dbConfig();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



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

app.post("/pay", async (req, res) => {
    try {

        let order = await razorpay.orders.create({
            amount: req.body.amount,
            currency: "INR",
            receipt: req.body.receipt,
        })

        res.json(order);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post("/payment/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const calculatedSignature = hmac.digest("hex");
        if (calculatedSignature === razorpay_signature) {
            res.json({ message: "Payment verified successfully" })
        } else {
            res.status(400).json({ error: "Payment verification failed" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" })
    }
})



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

