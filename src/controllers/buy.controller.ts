import { Request, Response } from "express";
import slugify from "slugify";
import Buy from "../models/buy";
// import { getBlurDataURL } from "../config/getBlurData";

//Create Buy
// export const CreateBuy = async (req: Request, res: Response) => {
//   try {
//     const { images, ...body } = req.body;

//     const uploadImages = await Promise.all(
//       images.map(async (image: { url: string }) => {
//         // const blurDataURL = await getBlurDataURL(image?.url)
//         // return ( ...image, blurDataURL);
//         return { ...image };
//       })
//     );

//     const data = await Buy.create({
//       ...body,
//       images: uploadImages,
//     });

//     res.status(201).json(data);
//   } catch (error) {
//     res.status(501).json({ error: "Failed to create property" });
//   }
// };
export const CreateBuy = async (req: Request, res: Response) => {
  try {
    const { images, name, ...body } = req.body;

    // Generate unique slug from name
    let slug = slugify(name, {
      lower: true, // convert to lowercase
      strict: true, // remove special chars
      trim: true,
    });

    // Check if slug already exists → append random number if needed
    let count = 1;
    let uniqueSlug = slug;
    while (await Buy.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const uploadImages = await Promise.all(
      images.map(async (image: { url: string }) => {
        return { ...image };
      })
    );

    const data = await Buy.create({
      ...body,
      name,
      slug: uniqueSlug, // ← added
      images: uploadImages,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
};
export const getFeaturedBuy = async (req: Request, res: Response) => {
  try {
    const property = await Buy.findOne({ isFeatured: true });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured property" });
  }
};

//Get all Buy data
export const GetBuys = async (req: Request, res: Response) => {
  try {
    const {
      location,
      propertyType,
      bedrooms,
      bathrooms,
      furnishing,
      minSize,
      maxSize,
      minPrice,
      maxPrice,
      amenities,
      features,
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    if (location) filter.location = location;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);
    if (furnishing) filter.furnishing = furnishing;
    if (minSize || maxSize) {
      filter.squareFeet = {};

      if (minSize) filter.squareFeet.$gte = Number(minSize);
      if (maxSize) filter.squareFeet.$lte = Number(maxSize);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenityArray = (amenities as string).split(",");
      filter.amenities = { $all: amenityArray };
    }

    if (features) {
      const featureArray = (features as string).split(",");
      filter.propertyFeatures = { $all: featureArray };
    }

    const data = await Buy.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Buy.countDocuments(filter);

    res.status(201).json({ data: data, total });
  } catch (error) {
    res.json(error);
  }
};

//Get  Buy data
export const GetBuy = async (req: Request, res: Response) => {
  try {
    const data = await Buy.findById(req.params.id);
    res.status(201).json(data);
  } catch (error) {
    res.json(error);
  }
};

export const GetBuyBySlug = async (req: Request, res: Response) => {
  try {
    const property = await Buy.findOne({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//delete buy property

export const DeleteBuy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Buy.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Career not found" });
    res.json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};

// export const UpdateBuy = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { images, ...body } = req.body;

//     const uploadImages = await Promise.all(
//       images.map(async (image: { url: string }) => {
//         // const blurDataURL = await getBlurDataURL(image.url);
//         return { ...image };
//       })
//     );

//     const updated = await Buy.findByIdAndUpdate(
//       id,
//       {
//         ...body,
//         images: uploadImages,
//       },
//       { new: true } // returns the updated document
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Property not found" });
//     }

//     res.status(200).json(updated);
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ error: "Failed to update property" });
//   }
// };
export const UpdateBuy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { images, name, ...body } = req.body;

    let slug = body.slug; // keep existing slug if provided

    // If name changed, regenerate slug
    if (name) {
      slug = slugify(name, { lower: true, strict: true, trim: true });

      let count = 1;
      let uniqueSlug = slug;
      while (await Buy.findOne({ slug: uniqueSlug, _id: { $ne: id } })) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }
      body.slug = uniqueSlug;
    }

    const uploadImages = await Promise.all(
      images.map(async (image: { url: string }) => {
        return { ...image };
      })
    );

    const updated = await Buy.findByIdAndUpdate(
      id,
      {
        ...body,
        name,
        images: uploadImages,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
};
