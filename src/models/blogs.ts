import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: { type: String, required: true },
  desc: { type: String, required: true },
  blogCover: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Blogs = mongoose.model("Blogs", blogSchema);
export default Blogs;
