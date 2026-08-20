import { Request, Response } from "express";
import OffPlan from "../models/offplan";
import slugify from "slugify";
/* =========================
   CREATE OFFPLAN
========================= */
// export const CreateOffplan = async (req: Request, res: Response) => {
//   try {
//     const { images, qr, apartmentTypes, status, price, isFeatured, ...rest } =
//       req.body;

//     const uploadImages =
//       images?.map((img: { url: string }) => ({ url: img.url })) || [];

//     const data = await OffPlan.create({
//       ...rest,
//       images: uploadImages,
//       apartmentTypes,
//       qr,
//       status: status || "draft",
//       isFeatured: Boolean(isFeatured),
//       price: {
//         value: Number(price?.value || 0),
//         unit: price?.unit || "M",
//       },
//     });

//     res.status(201).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create offplan" });
//   }
// };

export const CreateOffplan = async (req: Request, res: Response) => {
  try {
    const {
      images,
      qr,
      apartmentTypes,
      status,
      price,
      isFeatured,
      name,
      ...rest
    } = req.body;

    // Generate unique slug
    let slug = slugify(name, { lower: true, strict: true, trim: true });
    let count = 1;
    let uniqueSlug = slug;
    while (await OffPlan.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const uploadImages =
      images?.map((img: { url: string }) => ({ url: img.url })) || [];

    const data = await OffPlan.create({
      ...rest,
      name,
      slug: uniqueSlug,
      images: uploadImages,
      apartmentTypes,
      qr,
      status: status || "draft",
      isFeatured: Boolean(isFeatured),
      price: {
        value: Number(price?.value || 0),
        unit: price?.unit || "M",
      },
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create offplan" });
  }
};

/* =========================
   GET ALL OFFPLANS
========================= */
export const GetOffplans = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      propertyType,
      page = 1,
      limit = 10,
      admin,
    } = req.query;

    const filter: any = {};

    if (!admin) {
      filter.status = "published";
    }

    if (name) filter.name = { $regex: name, $options: "i" };
    if (location) filter.location = { $regex: `^${location}`, $options: "i" };
    if (propertyType) filter.propertyType = propertyType;

    const data = await OffPlan.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await OffPlan.countDocuments(filter);

    res.status(200).json({ data, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch offplans" });
  }
};

/* =========================
   GET SINGLE OFFPLAN
========================= */
export const GetOffplan = async (req: Request, res: Response) => {
  try {
    const data = await OffPlan.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Offplan not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch offplan" });
  }
};

// Add this new function
export const GetOffplanBySlug = async (req: Request, res: Response) => {
  try {
    const property = await OffPlan.findOne({ slug: req.params.slug });

    if (!property) {
      return res.status(404).json({ message: "Offplan property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("GetOffplanBySlug error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/* =========================
   UPDATE OFFPLAN
========================= */
// export const UpdateOffplan = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { images, apartmentTypes, qr, status, price, isFeatured, ...rest } =
//       req.body;

//     const uploadImages = images?.map((img: { url: string }) => ({
//       url: img.url,
//     }));

//     const updated = await OffPlan.findByIdAndUpdate(
//       id,
//       {
//         ...rest,
//         ...(status && { status }),
//         ...(uploadImages && { images: uploadImages }),
//         ...(apartmentTypes && { apartmentTypes }),
//         ...(qr && { qr }),
//         ...(typeof isFeatured === "boolean" && { isFeatured }),
//         ...(price && {
//           price: {
//             value: Number(price.value),
//             unit: price.unit,
//           },
//         }),
//       },
//       { new: true }
//     );

//     if (!updated) return res.status(404).json({ error: "Offplan not found" });

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update offplan" });
//   }
// };
export const UpdateOffplan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      images,
      apartmentTypes,
      qr,
      status,
      price,
      isFeatured,
      name, // extract name separately for slug logic
      ...rest
    } = req.body;

    // Prepare update object
    const updateData: any = { ...rest };

    // Handle images safely
    if (images && Array.isArray(images)) {
      updateData.images = images
        .map((img: { url: string }) => ({ url: img?.url || "" }))
        .filter((img) => img.url); // remove invalid/empty
    }

    // Apartment types
    if (apartmentTypes && Array.isArray(apartmentTypes)) {
      updateData.apartmentTypes = apartmentTypes;
    }

    // QR
    if (qr) {
      updateData.qr = qr;
    }

    // Status
    if (status !== undefined) {
      updateData.status = status;
    }

    // isFeatured
    if (typeof isFeatured === "boolean") {
      updateData.isFeatured = isFeatured;
    }

    // Price
    if (price && typeof price === "object") {
      updateData.price = {
        value: Number(price.value) || 0,
        unit: price.unit === "K" || price.unit === "M" ? price.unit : "M",
      };
    }

    // Slug regeneration: only if name is provided
    if (name) {
      let slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });

      let count = 1;
      let uniqueSlug = slug;

      // Check for uniqueness (exclude current document)
      while (
        await OffPlan.findOne({
          slug: uniqueSlug,
          _id: { $ne: id },
        })
      ) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }

      updateData.slug = uniqueSlug;
      updateData.name = name; // also update name if provided
    }

    // Perform update
    const updated = await OffPlan.findByIdAndUpdate(id, updateData, {
      new: true, // return updated doc
      runValidators: true, // enforce schema rules
      omitUndefined: true, // skip undefined fields
    });

    if (!updated) {
      return res.status(404).json({ error: "Offplan not found" });
    }

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("UpdateOffplan error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid offplan ID" });
    }

    if (error.code === 11000) {
      return res.status(409).json({ error: "Slug already exists" });
    }

    res.status(500).json({
      error: "Failed to update offplan",
      message: error.message || "Internal server error",
    });
  }
};

/* =========================
   DELETE OFFPLAN
========================= */
export const DeleteOffplan = async (req: Request, res: Response) => {
  try {
    const data = await OffPlan.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: "Offplan not found" });
    res.status(200).json({ message: "Deleted successfully", data });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete offplan" });
  }
};

/* =========================
   GET FEATURED OFFPLAN
========================= */
export const GetFeaturedOffplan = async (_req: Request, res: Response) => {
  try {
    const featured = await OffPlan.findOne({
      isFeatured: true,
      status: "published",
    }).sort({ updatedAt: -1 });
    if (!featured)
      return res.status(404).json({ error: "No featured offplan found" });
    res.status(200).json(featured);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch featured offplan" });
  }
};
