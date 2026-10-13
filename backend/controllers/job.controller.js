import JobModel from "../models/job.model.js"

export async function getJobs(req,res){
    try 
    {
        return res.json({
            success:true,
            jobs: await JobModel.find()
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({message:"Internal Server Error"});
        
    }

    
}