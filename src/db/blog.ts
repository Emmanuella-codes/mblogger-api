import mongoose from "mongoose";

//created on, created by, last updated
const BlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isLiked: { type: Boolean, default: false },
  comment: { type: String },
});

export const BlogModel = mongoose.model("Blog", BlogSchema);

export const getAllBlogs = () => BlogModel.find();
export const getUserBlogs = (id: string) => BlogModel.find({ user: id });
export const createBlog = (values: Record<string, any>) =>
  new BlogModel(values).save().then((user) => user.toObject());
export const updateBlogById = (id: string, values: Record<string, any>) =>
  BlogModel.findByIdAndUpdate(id, values);
export const deleteBlogById = (id: string) =>
  BlogModel.findOneAndDelete({ _id: id });
export const deleteCommentById = (commentId: string) =>
  BlogModel.findOneAndDelete({ _id: commentId });
