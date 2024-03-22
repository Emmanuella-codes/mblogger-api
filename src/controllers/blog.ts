import { createBlog } from "../db/blog";
import express from "express";
import { IUserRequest } from "types";

export const createBlogPost = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const { title, content } = req.body;
    const userId = req.user;
    console.log(userId);

    if (!title || !content) {
      return res.sendStatus(400);
    }

    const newBlog = await createBlog({
      user: userId,
      title,
      content,
    });

    return res
      .status(201)
      .json({
        newBlog,
        message: "Your blog post has been successfully created",
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
