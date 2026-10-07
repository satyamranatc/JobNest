import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"


userType = {
    Company: "Company",
    Candidate: "Candidate"
}

let userSchema = new mongoose.Schema({

    // Company,Candidate
    type: {
        type: String,
        enum: Object.values(userType),
        required: true
    },
    name: {
        type:String,
        required: true,
        trim: true,
    },
    avatar:{
        type: String,
        required: true,
        default:"https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png",
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

userSchema.pre("save",(req,res)=>{
    if(this.isModified("password")){
        this.password = bcrypt.hashSync(this.password,10);
    }

})


userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


userSchema.methods.generateAccessToken = function()
{
    let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    let payload = {
        _id: this._id,
        type: this.type,
        name: this.name,
        email: this.email
    };

    return jwt.sign(payload,accessTokenSecret,{expiresIn:"1d"});

}

userSchema.methods.generateRefreshToken = function()
{
    let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    let payload = {
        _id: this._id,
        type: this.type,
        name: this.name,
        email: this.email
    };


    let token = jwt.sign(payload,refreshTokenSecret,{expiresIn:"7d"});

    this.refreshToken = token;
    return token;
}


export default mongoose.model("User", userSchema);



