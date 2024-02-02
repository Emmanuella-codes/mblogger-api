import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
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
