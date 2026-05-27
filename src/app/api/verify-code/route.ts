import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (new Date(user.verifyCodeExpiry) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: "Incorrect Verification code" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying the code", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify user" },
      { status: 500 }
    );
  }
}
