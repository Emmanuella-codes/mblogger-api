import { getBlogPostById, getUserBlog } from "../db/blog";
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
    const { content } = req.body;
    const username = req.username;
    const { blogId } = req.params;

    if (!blogId) {
      return res.sendStatus(400);
    }

    const createdOn = new Date();
    createdOn.setHours(createdOn.getHours() + 1);
    const blog = await getBlogPostById(blogId);
    const selectedPost = blog.blogPost.find(
      (post) => post._id.toString() === blogId
    );

    if (!selectedPost) {
      return res.sendStatus(400);
    }

    selectedPost.hasComments.push({
      creator: username,
      comment: content,
      createdOn: createdOn,
    });

    await blog.save();

    return res
      .status(200)
      .json({
        message: "Comment added successfully",
      })
      .end();
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
    const { blogId, commentId } = req.params;

    if (!blogId || !commentId) {
      return res.sendStatus(400);
    }

    const blog = await getBlogPostById(blogId);
    if (!blog) {
      return res.sendStatus(404);
    }

    const selectedPost = blog.blogPost.find(
      (post) => post._id.toString() === blogId
    );

    if (!selectedPost) {
      return res.sendStatus(400);
    }

    const commentIdx = selectedPost.hasComments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIdx === -1) {
      return res.sendStatus(404);
    }

    selectedPost.hasComments.splice(commentIdx, 1);
    await blog.save();

    return res.status(200).json({ message: "Comment deleted successfully" });
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

    const user = await getUserBlog(userId);
    if (!user) {
      return res.sendStatus(404);
    }

    const blog = user.blogPost;

    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
