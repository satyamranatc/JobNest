import userModel from "../models/user.model.js";

export const register = async (req, res) => {
    try {
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
            return res.status(200).json({ accessToken, refreshToken });
        }
        return res.status(404).json({ message: "Password is incorrect" });
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