import mongoose from "mongoose";
import Buy from "../src/models/buy"; // adjust path to your model
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "";

async function addSlugs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const properties = await Buy.find({ slug: { $exists: false } });

    if (properties.length === 0) {
      console.log("All properties already have slugs. Done!");
      process.exit(0);
    }

    console.log(`Found ${properties.length} properties without slug`);

    for (const prop of properties) {
      if (!prop.name) {
        console.log(`Skipping ${prop._id} - no name`);
        continue;
      }

      let slug = slugify(prop.name, { lower: true, strict: true, trim: true });
      let count = 1;
      let uniqueSlug = slug;

      // Ensure uniqueness
      while (await Buy.findOne({ slug: uniqueSlug, _id: { $ne: prop._id } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      prop.slug = uniqueSlug;
      await prop.save();
      console.log(`Updated ${prop.name} → ${prop.slug}`);
    }

    console.log("All slugs added successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

addSlugs();
