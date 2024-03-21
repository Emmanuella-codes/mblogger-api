import mongoose, { Types } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpIn: { type: Date },
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    resetPassword: {
      resetToken: { type: String },
      expiresIn: { type: Date },
    },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
// export const getUserBySessionToken = (sessionToken: string) =>
//   UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string | Types.ObjectId) =>
  UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
