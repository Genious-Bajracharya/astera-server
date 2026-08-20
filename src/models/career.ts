import mongoose from "mongoose";

const CareerSchema =new mongoose.Schema({
    position :{
        type: String,
        required: true,
    },
    location :{
        type: String,
        required: true,
    },
    jobType :{
        type: String,
        required: true,
    },
    requirements :{
        type: [String],
        required: true,
    },
    responsibilities :{
        type: [String],
        required: true,
    },
    benefits :{
        type: [String],
        required: true,
    },

})

const Career = mongoose.model("Career",CareerSchema)
export default Career;