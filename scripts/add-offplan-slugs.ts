// scripts/add-offplan-slugs.ts

import mongoose from "mongoose";
import OffPlan from "../src/models/offplan"; // ← adjust path to match your project structure
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "";

async function addOffplanSlugs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const properties = await OffPlan.find({ slug: { $exists: false } });

    if (properties.length === 0) {
      console.log("All offplan properties already have slugs. Done!");
      process.exit(0);
    }

    console.log(`Found ${properties.length} offplan properties without slug`);

    for (const prop of properties) {
      if (!prop.name) {
        console.log(`Skipping ${prop._id} - no name`);
        continue;
      }

      let slug = slugify(prop.name, { lower: true, strict: true, trim: true });
      let count = 1;
      let uniqueSlug = slug;

      // Ensure uniqueness (exclude current document)
      while (
        await OffPlan.findOne({ slug: uniqueSlug, _id: { $ne: prop._id } })
      ) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      prop.slug = uniqueSlug;
      await prop.save();
      console.log(`Updated ${prop.name} → ${prop.slug}`);
    }

    console.log("All offplan slugs added successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

addOffplanSlugs();
