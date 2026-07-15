import type { Avatar, Message, User } from "@/types/User";
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },
  
},{ timestamps: true });

const avatarSchema = new Schema<Avatar>({
  fileId: {
    type: String,
    required: [true, "File ID is required"],
  },
  filePath: {
    type: String,
    required: [true, "File path is required"],
  },
}, { timestamps: true });

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [2, "Username must be at least 2 characters long"],
    maxlength: [12, "Username must be at most 12 characters long"],
    match: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
    avatar: { type: avatarSchema, default: null },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
