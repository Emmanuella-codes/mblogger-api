import { createBlog } from "db/blog";
import express from "express";

export const createBlogPost = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.sendStatus(400)
    }

    
   /*  const newBlog = await createBlog({
      title,
      content
      user: 
    })
 */
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
