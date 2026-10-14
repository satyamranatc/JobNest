import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.model.js";
import Job from "./models/job.model.js";

async function seedDatabase() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB.");

        // Clean up or find existing seed companies
        console.log("Creating 3 Companies...");
        const companiesData = [
            {
                name: "TechCorp Solutions",
                email: "contact@techcorp.io",
                password: "password123",
                type: "Company",
                avatar: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80"
            },
            {
                name: "Innovate Labs",
                email: "hr@innovatelabs.com",
                password: "password123",
                type: "Company",
                avatar: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80"
            },
            {
                name: "CloudScale Systems",
                email: "careers@cloudscale.net",
                password: "password123",
                type: "Company",
                avatar: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&auto=format&fit=crop&q=80"
            }
        ];

        const companies = [];
        for (const data of companiesData) {
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = await User.create(data);
                console.log(`Created company: ${user.name} (${user.email})`);
            } else {
                console.log(`Company already exists: ${user.name} (${user.email})`);
            }
            companies.push(user);
        }

        console.log("Creating 8 Jobs...");
        const jobsData = [
            {
                title: "Senior Full Stack Engineer",
                description: "Looking for a seasoned Full Stack Engineer with strong experience in React, Node.js, and distributed cloud systems to build scalable web applications.",
                location: "Bengaluru, India",
                salary: 2200000,
                type: "Full Time",
                workMode: "Work From Home",
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=80",
                company: companies[0]._id
            },
            {
                title: "Frontend Developer (React / Next.js)",
                description: "Join our frontend engineering team to design, build, and optimize high-performance interactive user interfaces for our flagship SaaS platform.",
                location: "Pune, India",
                salary: 1400000,
                type: "Full Time",
                workMode: "On Site",
                thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80",
                company: companies[0]._id
            },
            {
                title: "DevOps & Cloud Infrastructure Engineer",
                description: "We are seeking a DevOps Engineer to manage CI/CD pipelines, Kubernetes clusters, and automate AWS cloud infrastructure for reliability.",
                location: "Hyderabad, India",
                salary: 1800000,
                type: "Full Time",
                workMode: "Work From Home",
                thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&auto=format&fit=crop&q=80",
                company: companies[0]._id
            },
            {
                title: "AI / Machine Learning Engineer",
                description: "Work on cutting-edge generative AI models, NLP pipelines, and LLM integrations. Python, PyTorch, and vector database experience required.",
                location: "Bengaluru, India",
                salary: 2600000,
                type: "Full Time",
                workMode: "On Site",
                thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&auto=format&fit=crop&q=80",
                company: companies[1]._id
            },
            {
                title: "Product Design Intern (UI/UX)",
                description: "Exciting internship opportunity for design enthusiasts proficient in Figma, user research, wireframing, and interactive design systems.",
                location: "Remote",
                salary: 350000,
                type: "Internship",
                workMode: "Work From Home",
                thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=80",
                company: companies[1]._id
            },
            {
                title: "Backend Node.js Developer",
                description: "Develop robust REST and GraphQL microservices, optimize MongoDB queries, and implement secure authentication and caching workflows.",
                location: "Gurugram, India",
                salary: 1600000,
                type: "Full Time",
                workMode: "On Site",
                thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80",
                company: companies[1]._id
            },
            {
                title: "Data Analyst / BI Specialist",
                description: "Analyze user engagement, construct data visualization dashboards in Tableau/PowerBI, and translate raw data into actionable product insights.",
                location: "Mumbai, India",
                salary: 1200000,
                type: "Part Time",
                workMode: "Work From Home",
                thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
                company: companies[2]._id
            },
            {
                title: "Software Engineering Intern",
                description: "Great opportunity for fresh graduates or students in computer science to work alongside seasoned mentors on real-world production codebases.",
                location: "Bengaluru, India",
                salary: 400000,
                type: "Internship",
                workMode: "On Site",
                thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80",
                company: companies[2]._id
            }
        ];

        for (const job of jobsData) {
            const created = await Job.create(job);
            console.log(`Created job: "${created.title}" at company ID: ${created.company}`);
        }

        console.log("\nSeeding completed successfully!");
        console.log(`Total companies created/verified: ${companies.length}`);
        console.log(`Total jobs created: ${jobsData.length}`);
    } catch (error) {
        console.error("Seeding failed with error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
        process.exit(0);
    }
}

seedDatabase();
