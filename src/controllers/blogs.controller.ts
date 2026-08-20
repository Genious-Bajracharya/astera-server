import { Request, Response } from "express";
import Blogs from "../models/blogs";
import slugify from "slugify";

// Helper function to generate unique slug
const generateUniqueSlug = async (
  title: string,
  excludeId?: string
): Promise<string> => {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const existingBlog = await Blogs.findOne({
      slug: uniqueSlug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (!existingBlog) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

// GEt BLogs
export const GetBlogs = async (req: Request, res: Response) => {
  try {
    const data = await Blogs.find();
    res.status(201).json({ data });
  } catch (error) {
    res.json({ message: error });
  }
};

//get blog
export const GetBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ data: blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog", error });
  }
};

export const GetBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("GetBlogBySlug error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Create Blog

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, desc, blogCover } = req.body;

    if (!title || !content || !desc || !blogCover) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slug = await generateUniqueSlug(title);

    const newBlog = new Blogs({
      title,
      slug,
      content,
      desc,
      blogCover,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, desc, blogCover, slug: newSlug } = req.body;

    const blog = await Blogs.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let finalSlug = blog.slug;

    if (newSlug && newSlug !== blog.slug) {
      finalSlug = await generateUniqueSlug(newSlug, id);
    } else if (title && title !== blog.title) {
      finalSlug = await generateUniqueSlug(title, id);
    }

    // === IMPORTANT: Add custom classes to headings ===
    let processedContent = content || blog.content;

    // Make all <h2> tags 24px bold
    processedContent = processedContent.replace(
      /<h2([^>]*)>/gi,
      '<h2 class="text-[24px] font-semi-bold mb-2"$1>'
    );

    // Make all <h3> tags 18.78px semibold
    processedContent = processedContent.replace(
      /<h3([^>]*)>/gi,
      '<h3 class="text-[18.72px] font-semibold"$1>'
    );

    const updatedBlog = await Blogs.findByIdAndUpdate(
      id,
      {
        title: title || blog.title,
        slug: finalSlug,
        content: processedContent,
        desc: desc || blog.desc,
        blogCover: blogCover || blog.blogCover,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const createBlog = async (req: Request, res: Response) => {
//   try {
//     const { title, content, blogCover, desc } = req.body;

//     if (!title || !content || !blogCover) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const blog = new Blogs({ title, content, blogCover, desc });
//     await blog.save();
//     res.status(201).json(blog);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating blog", error });
//   }
// };

// Update Blog
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, content, desc, blogCover, slug: newSlug } = req.body;

//     const blog = await Blogs.findById(id);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     let finalSlug = blog.slug;

//     // Priority 1: If user explicitly sends a new slug → use it (and make sure it's unique)
//     if (newSlug && newSlug !== blog.slug) {
//       finalSlug = await generateUniqueSlug(newSlug, id);
//     }
//     // Priority 2: If title changed and no new slug was sent → regenerate from title
//     else if (title && title !== blog.title) {
//       finalSlug = await generateUniqueSlug(title, id);
//     }
//     // Otherwise keep the existing slug

//     const updatedBlog = await Blogs.findByIdAndUpdate(
//       id,
//       {
//         title: title || blog.title,
//         slug: finalSlug,
//         content: content || blog.content,
//         desc: desc || blog.desc,
//         blogCover: blogCover || blog.blogCover,
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "Blog updated successfully",
//       blog: updatedBlog,
//     });
//   } catch (error: any) {
//     console.error("Error updating blog:", error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, content, desc, blogCover } = req.body;

//     const blog = await Blogs.findById(id);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     let slug = blog.slug;

//     // Regenerate slug only if title has changed
//     if (title && title !== blog.title) {
//       slug = await generateUniqueSlug(title, id);
//     }

//     const updatedBlog = await Blogs.findByIdAndUpdate(
//       id,
//       {
//         title: title || blog.title,
//         slug,
//         content: content || blog.content,
//         desc: desc || blog.desc,
//         blogCover: blogCover || blog.blogCover,
//       },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       message: "Blog updated successfully",
//       blog: updatedBlog,
//     });
//   } catch (error: any) {
//     console.error("Error updating blog:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, content, desc, blogCover } = req.body; // Added desc and blogCover

//     const blog = await Blogs.findByIdAndUpdate(
//       id,
//       { title, content, desc, blogCover }, // Include all fields
//       { new: true }
//     );

//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.json(blog);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating blog", error });
//   }
// };

// Delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
