"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Ghost,
  Send,
  Sparkles,
  Smile,
  RefreshCw,
  Pin,
  Shield,
} from "lucide-react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Message } from "@/types/User";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { Textarea } from "@/components/ui/textarea";
import { FormTextarea } from "@/components/ui/form-elements";

const PINNED_MESSAGES = [
  {
    id: 1,
    text: "Your new project looks absolutely incredible. How did you learn to design like that? 🤩",
    color: "bg-blue-500",
  },
];

const SUGGESTED_MESSAGES = [
  "Your new project looks absolutely incredible. How did you learn to design like that? 🤩",
  "I really admire your confidence and how you carry yourself. It's inspiring! ✨",
  "You have such a unique sense of style, I love it! 🎨",
];

export default function PublicBoard({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      toast.success(response.data.message);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage ?? "Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl relative z-10">
        {/* Header / User Card */}
        <UserCard username={username} />

        {/* Input Area */}
        <Card className="p-1 border-primary/30 shadow-[0_0_30px_rgba(124,58,237,0.1)] focus-within:shadow-[0_0_30px_rgba(124,58,237,0.3)] bg-card/80 backdrop-blur-xl mb-6 transition-shadow duration-200">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="bg-background rounded-[12px] p-4 relative focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200"
          >
            <FormTextarea
              control={form.control}
              name="content"
              placeholder={`Send an anonymous message to @${username}...`}
              className="w-full h-32 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-0 focus:ring-0 focus:border-0 ring-0 border-0 p-0 aria-invalid:ring-0 "
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs font-mono">
                  {form.watch("content").length}/500
                </span>
              </div>
              <Button
                type="submit"
                disabled={form.watch("content").trim().length === 0}
                className="h-10 rounded-full shadow-lg shadow-primary/25 px-4"
              >
                Send Anonymously <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 mb-8">
          <Shield /> Your identity is 100% hidden. We never reveal senders.
        </p>

        {/* AI Suggestions */}
        <AISuggestions form={form} />

        {/* Pinned Messages Highlights */}
        <PinnedMessages />
      </main>

      <footer className="py-6 border-t border-white/5 mt-auto relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-foreground opacity-80 hover:opacity-100 transition-opacity"
          >
            <Ghost className="w-4 h-4" /> AnoniMessage
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white/5"
          >
            <Link href="/sign-up">Get your own AnoniMessage board &rarr;</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}

function UserCard({ username }: { username: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await axios.get(`/api/avatar?username=${username}`);
        const data = await response.data;
        if (data.success) {
          setAvatarUrl(
            `https://ik.imagekit.io/anonimessage/${data.avatar.filePath}`,
          );
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [username]);

  return (
    <div className="text-center mb-10">
      <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-xl ring-2 ring-primary/20">
        <AvatarImage src={avatarUrl || username} />
        <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold uppercase">
          {username?.charAt(0) || "A"}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-heading font-bold text-foreground">
        @{username}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
        Send me an anonymous message. I won't know who it's from!
      </p>
    </div>
  );
}

function AISuggestions({
  form,
}: {
  form: UseFormReturn<z.infer<typeof messageSchema>>;
}) {
  const [messages, setMessages] = useState<string[]>([...SUGGESTED_MESSAGES]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSuggestMessages = async () => {
    setMessages([]);
    setLoading(true);
    const response = await axios.get("/api/suggest-messages");
    if (!response.data.success) {
      toast.error(response.data.message);
      return;
    }
    if (response.data.messages) {
      setMessages(response.data.messages);
    }
    setLoading(false);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-secondary" /> AI Suggestions
        </div>
        <button
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          onClick={handleSuggestMessages}
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>
      <div className="relative overflow-hidden flex flex-wrap gap-2">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                className={cn(
                  "relative overflow-hidden w-full h-8 bg-accent/90 rounded-full",
                )}
                key={i}
              />
            ))
          : messages?.map((msg, i) => (
              <button
                key={i}
                onClick={() => {
                  form.setValue("content", msg);
                  form.trigger("content");
                }}
                className="w-full min-h-8 bg-accent/50 hover:bg-accent text-sm text-foreground/80 px-4 py-2 rounded-full border border-white/5 transition-colors text-left"
              >
                {msg}
              </button>
            ))}
      </div>
    </div>
  );
}

function PinnedMessages() {
  return (
    PINNED_MESSAGES.length > 0 && (
      <div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5 px-1">
          <Pin className="w-3.5 h-3.5" /> Pinned Highlights
        </div>
        <div className="grid gap-4">
          {PINNED_MESSAGES.map((msg) => (
            <Card key={msg.id} className="p-4 border-white/5 bg-white/2">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full ${msg.color} flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  ?
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Anonymous
                </span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </Card>
          ))}
        </div>
      </div>
    )
  );
}
