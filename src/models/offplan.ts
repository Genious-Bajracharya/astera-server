import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
  url: { type: String, required: true },
});

const apartmentTypeSchema = new Schema({
  propertyType: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: String, required: false },
});

const OffPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    location: { type: String, required: true },
    description: { type: String, required: true },

    propertyType: { type: String },
    squareFeet: { type: String },
    bedroom: { type: String },

    price: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["K", "M"],
        default: "M",
      },
    },

    bookingAmount: { type: Number, required: true },
    handover: { type: Number, required: true },
    commission: { type: Number, required: true },
    onBooking: { type: Number, required: true },
    construction: { type: Number, required: true },
    onHandover: { type: Number, required: true },

    keyHighlight: [String],
    overview: [String],
    invest: [String],
    community: [String],

    video: { type: String },

    qr: {
      url: { type: String },
    },

    images: { type: [imageSchema], required: true },
    apartmentTypes: { type: [apartmentTypeSchema] },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // ⭐ ADDED: Featured property field
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OffPlan = mongoose.model("OffPlan", OffPlanSchema);
export default OffPlan;
