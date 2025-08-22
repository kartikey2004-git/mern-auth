import { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import { createBlog, deleteBlog, getOneBlog, listMineBlogs, listPublished, updateBlog } from "../controllers/blogController.js";


const blogRouter = Router();

// public routes
blogRouter.get("/", listPublished);
blogRouter.get("/:id",getOneBlog)


// authenticated routes

blogRouter.get("/me/all",userAuth,listMineBlogs)
blogRouter.post("/create",userAuth,createBlog)
blogRouter.put("/update/:id",userAuth,updateBlog)
blogRouter.delete("/delete/:id",userAuth,deleteBlog)

export default blogRouter