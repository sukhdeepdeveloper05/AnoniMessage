import UserModel from "@/models/User";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required parameters",
      },
      { status: 400 },
    );
  }

  const user = await UserModel.findOne({ username }).exec();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      avatar: user.avatar,
      message: "Avatar fetched successfully",
    },
    { status: 200 },
  );
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const prevImageId = searchParams.get("id");

  if (!prevImageId) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing required parameters",
      },
      { status: 400 },
    );
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing ImageKit private key",
      },
      { status: 500 },
    );
  }

  const options = {
    method: "DELETE",
    url: `https://api.imagekit.io/v1/files/${prevImageId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
    },
  };

  try {
    const { data } = await axios.request(options);

    console.log(data);
    return NextResponse.json(
      {
        success: true,
        message: "Image deleted successfully",
      },
      { status: 203 },
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(axiosError.response?.data);
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message:
          (axiosError.response?.data as any)?.message ||
          axiosError.message ||
          "Failed to delete image",
      },
      { status: axiosError.response?.status || 500 },
    );
  }
}
