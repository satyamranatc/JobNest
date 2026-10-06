import "dotenv/config"
import mongoose from "mongoose"

export default  function dbConfig() 
{
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err))
    
}