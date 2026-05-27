import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";
import axios from "axios";
import { User } from "@/types/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, isVerified, imageUrl } =
      await request.json();

    const existingUserByUsername = await UserModel.findOne({
      username,
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    // Upload Google profile picture to ImageKit if provided
    let avatar = undefined;
    if (imageUrl) {
      try {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        if (!privateKey) {
          throw new Error("Private key is not defined");
        }

        const formData = new FormData();
        formData.append("file", imageUrl);
        formData.append("fileName", `avatar-${username}`);
        formData.append("useUniqueFileName", "false");
        formData.append("folder", "anonimessage-users");

        const authHeader = `Basic ${Buffer.from(privateKey + ":").toString("base64")}`;

        const imageKitResponse = await axios.post(
          "https://upload.imagekit.io/api/v2/files/upload",
          formData,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );

        const ikData = imageKitResponse.data;
        avatar = {
          fileId: ikData.fileId,
          filePath: ikData.filePath,
          updatedAt: new Date(),
        };
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Error uploading Google avatar to ImageKit:",
            err.response?.data.message
          );
        }
        console.error("Error uploading Google avatar to ImageKit:", err);
      }
    }

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified && !isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        const updateFields: any = {
          username,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
          isVerified: isVerified || false,
        };
        if (avatar) {
          updateFields.avatar = avatar;
        }

        await UserModel.updateOne(
          {
            email,
          },
          {
            $set: updateFields,
          }
        );
      }
    } else {
      //Create new user
      const userFields: any = {
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: isVerified || false,
      };
      if (avatar) {
        userFields.avatar = avatar;
      }

      await UserModel.create(userFields);
    }

    if (!isVerified) {
      //Send Verification Email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "User registered successfully. Check your email for verification code.",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
