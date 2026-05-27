import { ApiResponse } from "@/types/ApiResponse";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
  upload,
} from "@imagekit/next";
import axios, { AxiosError } from "axios";
import React, { useRef } from "react";

const useUpload = () => {
  const [progress, setProgress] = React.useState<number>(0);
  const abortController = useRef(new AbortController());

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async ({
    file,
    username,
    prevImageId,
  }: {
    file: File | null;
    username: string;
    prevImageId?: string;
  }): Promise<ApiResponse> => {
    // Access the file input element using the ref
    if (!file) {
      return {
        success: false,
        message: "Please select a file to upload",
      };
    }

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return {
        success: false,
        message: "Authentication failed",
      };
    }
    const { signature, expire, token, publicKey } = authParams;

    // If there's a previous image, attempt to delete it before uploading the new one.
    if (prevImageId) {
      try {
        const { data } = await axios.request({
          method: "DELETE",
          url: `/api/avatar?id=${prevImageId}`,
        });
        console.log(data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(axiosError.response?.data);
        if (axiosError.response?.status === 404) {
          console.warn("Previous image not found");
        } else {
          return {
            success: false,
            message: "Failed to delete previous image",
          };
        }
      }
    }

    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: `avatar-${username}`,
        folder: "anonimessage-users",
        transformation: { pre: "w-200,h-200" },
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.current.signal,
      });
      console.log("Upload response:", uploadResponse);

      const { fileId, filePath } = uploadResponse;

      if (!uploadResponse || !fileId || !filePath) {
        return {
          success: false,
          message: "Upload failed",
        };
      }

      return {
        success: true,
        message: "Upload successful",
        avatar: {
          fileId: fileId,
          filePath: filePath,
          updatedAt: new Date(),
        },
      };
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }

      return {
        success: false,
        message: "Upload failed",
      };
    }
  };

  return { handleUpload, progress };
};

export default useUpload;
