import express from "express"
import "dotenv/config"
import cors from "cors"
import dbConfig from "./config/db.js"


const app = express();
app.use(express.json())
app.use(cors())

dbConfig();



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
