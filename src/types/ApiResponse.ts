import { Message } from "./User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[];
  avatar?: {
    fileId: string;
    filePath: string;
    versionId: string;
    updatedAt: Date;
  };
  pagination?: {
    currentPage: number;
    limit: number;
    totalMessages: number;
    totalPages: number;
  };
}
