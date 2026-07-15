import { Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface Avatar extends Document {
  fileId: string;
  filePath: string;
  updatedAt: Date;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatar?: {
    fileId: string;
    filePath: string;
    updatedAt: Date;
  };
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
