import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema({
  creator: { type: String },
  comment: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      text: { type: String },
      createdOn: { type: Date },
    },
  ],
});

//created on, created by, last updated
const BlogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blogPost: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
      title: { type: String, required: true, maxlength: 50 },
      content: { type: String, required: true, maxlength: 250 },
      createdOn: { type: Date, required: true },
      lastModifed: { type: Date },
      isLiked: { type: Boolean, default: false },
      hasComments: [CommentSchema],
    },
  ],
});

export const BlogModel = mongoose.model("Blog", BlogSchema);

export const getAllBlogs = () => BlogModel.find();
export const getUserBlog = (user: string) => BlogModel.findOne({ user });
export const createBlog = (values: Record<string, any>) =>
  new BlogModel(values).save().then((user) => user.toObject());
//identify the user blog
export const getUserBlogById = (id: string | Types.ObjectId) =>
  BlogModel.findById(id);
export const getBlogPostById = (id: string | Types.ObjectId) =>
  BlogModel.findOne({ "blogPost.id": id });
export const updateBlogById = (id: string) => BlogModel.findByIdAndUpdate(id);
export const deleteBlogById = (id: string) =>
  BlogModel.findOneAndDelete({ _id: id });
export const deleteCommentById = (commentId: string) =>
  BlogModel.findOneAndDelete({ _id: commentId });
