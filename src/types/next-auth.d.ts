import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
      avatar?: {
        fileId: string;
        filePath: string;
        updatedAt?: Date | string;
      } | null;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    avatar?: {
      fileId: string;
      filePath: string;
      updatedAt?: Date | string;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    avatar?: {
      fileId: string;
      filePath: string;
      updatedAt?: Date | string;
    } | null;
  }
}
