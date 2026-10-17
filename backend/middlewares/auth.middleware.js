import jwt from "jsonwebtoken";
import "dotenv/config";

export async function authMiddleware(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    let token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const secret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;
        let payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export function roleMiddleware(role) {
    return (req, res, next) => {
        const userRole = req.user?.role || req.user?.type;
        if (userRole !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
export function optionalAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const secret = process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET;
                req.user = jwt.verify(token, secret);
            } catch {
                // Ignore token errors for optional auth
            }
        }
    }
    next();
}
