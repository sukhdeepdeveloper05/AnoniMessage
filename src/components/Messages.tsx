import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/types/User";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Skeleton } from "./ui/skeleton";
import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Messages({
  page,
  limit,
  session,
}: {
  page: string;
  limit: string;
  session: Session | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { update } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const [isAcceptingMessages, setIsAcceptingMessages] = useState<boolean>(
    session?.user.isAcceptingMessages || false
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/accept-messages");
        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }
        if (Boolean(res.data.isAcceptingMessages) !== isAcceptingMessages) {
          setIsAcceptingMessages(res.data.isAcceptingMessages as boolean);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast.error(
          errorMessage ??
            "There was a problem in fetching accept messages status. Please try again."
        );
      }
    })();
  }, []);

  const handleAcceptMessages = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !isAcceptingMessages,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setIsAcceptingMessages(res.data.isAcceptingMessages as boolean);
      await update({
        isAcceptingMessages: res.data.isAcceptingMessages as boolean,
      });
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast.error(
        errorMessage ??
          "There was a problem while updating accept messages status. Please try again."
      );
    }
  };

  const fetchMessages = async (page: string, limit: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>(
        `/api/get-messages?page=${page}&limit=${limit}`
      );
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setMessages(res.data.messages || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage ?? "Problem in fetching messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(page, limit);
  }, [page, limit]);

  return (
    <div className="space-y-6">
      {/* Inbox Header with Accepting Messages switch pill */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/40">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inbox Feed</h2>
          <p className="text-sm text-muted-foreground">
            Manage and read your anonymous messages
          </p>
        </div>

        {/* Pulsing Active Switch Pill */}
        <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/60 shadow-sm transition-all hover:border-border">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full animate-pulse",
                isAcceptingMessages
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-muted"
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {isAcceptingMessages ? "Active" : "Paused"}
            </span>
          </div>
          <span className="text-xs font-semibold text-foreground pl-2 border-l border-border/60">
            Accept Messages
          </span>
          <Switch
            checked={isAcceptingMessages}
            onCheckedChange={handleAcceptMessages}
          />
        </div>
      </div>

      {/* Messages list with loaded / loading / empty states */}
      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: Number(limit) }).map((_, i) => (
            <div
              key={i}
              className="p-5 border border-border/40 rounded-2xl bg-card/20 flex gap-4"
            >
              <Skeleton className="size-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.length > 0 ? (
            messages.map((message, i) => (
              <div
                key={message.content + i}
                className="p-5 border border-border/60 rounded-2xl bg-card/30 hover:bg-card/50 shadow-sm transition-all duration-200 hover:border-border group relative flex items-start gap-4"
              >
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/20 group-hover:border-primary/25 transition-all">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-foreground font-sans leading-relaxed text-sm md:text-base wrap-break-word">
                    {message.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Premium Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border/80 rounded-2xl bg-card/10 text-center space-y-4">
              <div className="size-16 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                <MessageSquare className="w-8 h-8 opacity-40" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Inbox is empty</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No anonymous messages yet. Copy your board link and share it
                  to start receiving questions!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inbox Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-border/40">
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 cursor-pointer text-xs font-semibold"
            disabled={parseInt(page) === 1 || isLoading}
            onClick={() =>
              router.push(`${pathname}?page=${parseInt(page) - 1}`)
            }
          >
            Previous
          </Button>
          <span className="text-xs font-mono font-bold">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 cursor-pointer text-xs font-semibold"
            disabled={parseInt(page) === totalPages || isLoading}
            onClick={() =>
              router.push(`${pathname}?page=${parseInt(page) + 1}`)
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
