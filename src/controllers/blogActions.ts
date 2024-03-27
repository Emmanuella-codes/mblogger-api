import { getBlogPostById, updateBlogById } from "../db/blog";
import express from "express";
import { IUserRequest } from "types";

export const likePost = async (req: IUserRequest, res: express.Response) => {
  try {
    const username = req.username;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }

    const blog = await getBlogPostById(blogId);
    const selectedPost = blog.blogPost.find(
      (post) => post._id.toString() === blogId
    );

    if (!selectedPost) {
      return res.sendStatus(400);
    }

    if (selectedPost.likes.usernames.includes(username)) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    selectedPost.likes.count++;
    selectedPost.likes.usernames.push(username);

    await blog.save();

    return res
      .status(200)
      .json({
        message: "Blog post liked successfully",
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const unlikePost = async (req: IUserRequest, res: express.Response) => {
  try {
    const username = req.username;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }

    const blog = await getBlogPostById(blogId);
    const selectedPost = blog.blogPost.find(
      (post) => post._id.toString() === blogId
    );

    if (!selectedPost) {
      return res.sendStatus(400);
    }

    const usernameIdx = selectedPost.likes.usernames.indexOf(username);
    if (usernameIdx === -1) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    selectedPost.likes.count--;
    selectedPost.likes.usernames.splice(usernameIdx, 1);

    await blog.save();

    return res
      .status(200)
      .json({
        message: "Blog post unliked successfully",
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const commentOnPost = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const userId = req.userID;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteCommentOnPost = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const userId = req.userID;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUserBlogPosts = async (
  req: IUserRequest,
  res: express.Response
) => {
  try {
    const userId = req.userID;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
