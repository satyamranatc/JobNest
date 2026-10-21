import userModel from "../models/user.model.js";
import { uploadToCloudinary } from "../config/cloudinaryConfig.js";

export const register = async (req, res) => {
    try {
        const file =
            req.file ||
            req.files?.avatar?.[0] ||
            req.files?.image?.[0] ||
            (Array.isArray(req.files) ? req.files[0] : null);

        if (file && (!req.body.avatar || !req.body.avatar.startsWith("http"))) {
            const uploadResult = await uploadToCloudinary(file, "jobnest/avatars");
            req.body.avatar = uploadResult.secure_url;
        }

        const user = await userModel.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const login = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let user = await userModel.findOne({ email: email });

    if(user)
    {
        if(user.comparePassword(password))
        {
            let accessToken = user.generateAccessToken();
            let refreshToken = user.generateRefreshToken();
            await user.save();
            return res.status(200).json({ 
                accessToken, 
                refreshToken,
                user: { _id: user._id, name: user.name, email: user.email, type: user.type }
            });
        }
        return res.status(400).json({ message: "Password is incorrect" });
    }
    return res.status(404).json({ message: "User not found" });
}

export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const refreshToken = async (req, res) => {
    try {
        let refreshToken = req.body.refreshToken;
        let user = await userModel.findOne({ refreshToken: refreshToken });
        let accessToken = user.generateAccessToken();
        return res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json(error);
    }
}