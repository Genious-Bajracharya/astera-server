import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  img: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
