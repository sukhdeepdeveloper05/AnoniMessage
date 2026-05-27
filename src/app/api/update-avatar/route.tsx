import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Avatar {
  fileId: string;
  filePath: string;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const {
      avatar,
    }: {
      avatar: Avatar;
    } = await request.json();

    if (!avatar.fileId || !avatar.filePath) {
      return NextResponse.json(
        {
          success: false,
          message: "fileId and filePath are required",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findByIdAndUpdate(session.user._id, {
      avatar: {
        fileId: avatar.fileId,
        filePath: avatar.filePath,
        updatedAt: new Date(avatar.updatedAt),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
      avatar,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
