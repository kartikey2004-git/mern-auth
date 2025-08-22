import { Blog } from "../models/blogModels.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, published } = req.body;

  const blog = await Blog.create({
    author: req.user?._id,
    title,
    content,
    tags: Array.isArray(tags)
      ? tags
      : tags
      ? String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    published: !!published,
  });
  return res.status(201).json(new ApiResponse(201, blog, "Blog created"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, published } = req.body;

  const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });

  if (!blog)
    return res.status(404).json(new ApiResponse(404, null, "Not found"));

  if (title !== undefined) blog.title = title;

  if (content !== undefined) blog.content = content;

  if (tags !== undefined)
    blog.tags = Array.isArray(tags)
      ? tags
      : String(tags)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

  if (published !== undefined) blog.published = !!published;

  await blog.save();

  return res.status(200).json(new ApiResponse(200, blog, "Blog updated"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndDelete({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!blog)
    return res.status(404).json(new ApiResponse(404, null, "Not found"));

  return res.status(200).json(new ApiResponse(200, null, "Blog deleted"));
});

// Authed: my blogs
export const listMineBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id }).sort({
    updatedAt: -1,
  });

  return res.status(200).json(new ApiResponse(200, blogs, "My blogs"));
});



// Public: list published blogs
export const listPublished = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ published: true })
    .populate("author", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, blogs, "Published blogs"));
});

// Public: get single blog if published
export const getOneBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name");

  if (!blog)
    return res.status(404).json(new ApiResponse(404, null, "Not found"));

  if (!blog.published)
    return res.status(403).json(new ApiResponse(403, null, "Not public"));

  return res.status(200).json(new ApiResponse(200, blog, "Blog"));
});
