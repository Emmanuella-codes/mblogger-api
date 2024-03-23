import { createBlog, getUserBlog } from "../db/blog";
import express from "express";
import { IUserRequest } from "types";

export const createBlogPost = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const { title, content } = req.body;
    const userId = req.user;

    if (!title || !content) {
      return res.sendStatus(400);
    }

    const createdOn = new Date();
    createdOn.setHours(createdOn.getHours() + 1);

    const newBlog = await createBlog({
      user: userId,
      blogPost: {
        title,
        content,
        createdOn,
      },
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

export const editBlogPost = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const { title, content } = req.body;
    const userId = req.user;
    const { blogId } = req.params;

    if (!title || !content || !blogId) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const createdOn = new Date();
    createdOn.setHours(createdOn.getHours() + 1);

    const userBlogPost = await getUserBlog(userId as string);
    console.log(userBlogPost);
    if (!userBlogPost) {
      return res.status(400).json({ message: "User's blog post not found" });
    }

    const postToUpdate = userBlogPost.blogPost.find(
      (post) => post._id.toString() === blogId
    );
    if (!postToUpdate) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    postToUpdate.title = title;
    postToUpdate.content = content;
    postToUpdate.lastModifed = createdOn;

    await userBlogPost.save();

    return res
      .status(200)
      .json({ userBlogPost, message: "Your blog post edit was successfull" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
