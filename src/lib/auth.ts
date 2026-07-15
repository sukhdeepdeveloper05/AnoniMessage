import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        identifier: {
          type: "text",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        const { identifier, password } = credentials;

        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          throw new Error("User not found!");
        }

        if (!user.isVerified) {
          throw new Error("User not verified!");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
          avatar: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser || !existingUser.username) {
          console.log("Google User: ", user);
          const googleImage = user.image
            ? `&imageUrl=${encodeURIComponent(user.image)}`
            : "";
          return `/sign-up?email=${user.email}&fromGoogle=true${googleImage}`;
        }

        user._id = existingUser._id;
        user.username = existingUser.username;
        user.avatar = existingUser.avatar;
        user.isVerified = existingUser.isVerified;
        user.isAcceptingMessages = existingUser.isAcceptingMessages;
        return true;
      }
      return true;
    },
    async jwt({ token, trigger, session, user }: any) {
      if (user) {
        token._id = user._id?.toString() ?? user.id;
        token.username = user.username;
        token.name = user.name ?? user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.avatar = user.avatar;
      }

      if (trigger === "update" && session?.isAcceptingMessages !== undefined) {
        token.isAcceptingMessages = session.isAcceptingMessages;
      }

      if (trigger === "update" && session?.avatar !== undefined) {
        token.avatar = session.avatar;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user._id = token._id;
      session.user.username = token.username;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessages = token.isAcceptingMessages;
      session.user.avatar = token.avatar;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
  pages: {
    signIn: "/sign-in",
  },
};
