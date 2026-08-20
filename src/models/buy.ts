import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  blurDataURL: { type: String },
});

const buySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  squareFeet: {
    type: Number,
    required: true,
  },
  furnishing: {
    type: String,
    required: true,
  },
  propertyFeatures: {
    type: [String],
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  video: {
    type: String,
    required: false,
  },
  images: { type: [imageSchema], required: true },
  isFeatured: { type: Boolean, default: false },
});

const Buy = mongoose.model("Buy", buySchema);
export default Buy;
