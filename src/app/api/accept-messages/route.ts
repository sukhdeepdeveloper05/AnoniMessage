import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/types/User";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
        message: "Accept Messages status fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching acceptMessages status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch acceptMessages status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { acceptMessages } = await request.json();

    if (acceptMessages === undefined || acceptMessages === null) {
      return NextResponse.json(
        { success: false, message: "acceptMessages is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // findByIdAndUpdate directly performs the update in MongoDB, returning updated document
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user._id,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Accept Messages status updated successfully",
        isAcceptingMessages: acceptMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating acceptMessages status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update Accept Messages status" },
      { status: 500 }
    );
  }
}
