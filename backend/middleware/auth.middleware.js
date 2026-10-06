import jwt from "jsonwebtoken";
import "dotenv/config";

export async function authMiddleware(req,res,next) 
{
    if(!req.headers.authorization)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    let token = req.headers.authorization.split(" ")[1];

    if (!token)
    {
        return res.status(401).json({message:"Unauthorized"});
    }

    try {
        let payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = payload;
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"});
    }

    next();
    
}