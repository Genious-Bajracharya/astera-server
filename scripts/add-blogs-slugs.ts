// scripts/add-blogs-slugs.ts

import mongoose from "mongoose";
import Blogs from "../src/models/blogs"; // ← adjust path to match your project
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

async function addBlogSlugs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const blogs = await Blogs.find({ slug: { $exists: false } });

    if (blogs.length === 0) {
      console.log("All blogs already have slugs. Done!");
      process.exit(0);
    }

    console.log(`Found ${blogs.length} blogs without slug`);

    for (const blog of blogs) {
      if (!blog.title) {
        console.log(`Skipping blog ${blog._id} - no title`);
        continue;
      }

      let slug = slugify(blog.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      let count = 1;
      let uniqueSlug = slug;

      // Ensure uniqueness (exclude current document)
      while (
        await Blogs.findOne({ slug: uniqueSlug, _id: { $ne: blog._id } })
      ) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      blog.slug = uniqueSlug;
      await blog.save();
      console.log(`Updated "${blog.title}" → ${blog.slug}`);
    }

    console.log("All blog slugs added successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

addBlogSlugs();
