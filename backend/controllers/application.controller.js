import applicationModel from "../models/application.model";


export async function applyJob(req,res)
{
    const candidateId = req.user.id;
    let {jobId , resume} = req.body;

    if (!jobId || !resume)
    {
        return res.status(400).json({message: "All fields are required"});
    }

    try
    {
        let newApp = new applicationModel({
            candidate:candidateId,
            job:jobId,
            resume:resume,
        });

        await newApp.save();

        return res.status(201).json({message: "Job applied successfully"});
        
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }

}
