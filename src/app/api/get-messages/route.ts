import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : null;
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    const paginatedMessagesPipeline: any[] = [];
    if (page && limit && !isNaN(page) && !isNaN(limit)) {
      paginatedMessagesPipeline.push(
        { $skip: (page - 1) * limit },
        { $limit: limit },
      );
    }

    paginatedMessagesPipeline.push({
      $replaceRoot: { newRoot: "$messages" },
    });

    const aggregateResult = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(session.user._id),
        },
      },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $facet: {
          paginatedMessages: paginatedMessagesPipeline,
          totalCount: [{ $count: "count" }],
        },
      },
    ]).exec();

    const messages = aggregateResult[0]?.paginatedMessages || [];
    const totalMessages = aggregateResult[0]?.totalCount[0]?.count || 0;

    return NextResponse.json(
      {
        success: true,
        message: "Messages fetched successfully",
        messages,
        pagination: {
          currentPage: page || 1,
          limit: limit || totalMessages,
          totalMessages,
          totalPages: limit ? Math.ceil(totalMessages / limit) : 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get messages" },
      { status: 500 },
    );
  }
}
