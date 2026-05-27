"use client";
import DropZone from "@/components/DropZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TwitterIcon } from "@/components/icons";
import useUpload from "@/hooks/useUpload";
import { useSessionStore } from "@/store/session";
import axios from "axios";
import {
  Copy,
  Ghost,
  MessageCircle,
  Smartphone,
  LogOut,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import Image from "next/image";
import Messages from "@/components/Messages";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "8";

  const { session } = useSessionStore();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Sticky Premium Glassmorphic Navbar */}
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-heading font-extrabold text-foreground hover:opacity-90 transition-all group"
          >
            <Ghost className="w-5 h-5 text-primary animate-pulse group-hover:scale-110 transition-transform" />
            <span>AnoniMessage</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold tracking-tight leading-none mb-0.5">
                {session?.user?.name || session?.user?.username}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                @{session?.user?.username}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted/80 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Container */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar — Profile & Share Links */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Account Profile Card */}
            <ProfileCard session={session} />

            {/* Sharing Link Board Card */}
            <ShareBoardCard session={session} />
          </aside>

          {/* Right Section — Messages Inbox Feed */}
          <section className="lg:col-span-8">
            <Messages page={page} limit={limit} session={session} />
          </section>
        </div>
      </main>
    </div>
  );
}

function ProfileCard({ session }: { session: Session | null }) {
  const { update } = useSession();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { handleUpload } = useUpload();

  const handleUpdateAvatar = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const uploadResponse = await handleUpload({
      file: selectedFile,
      username: session?.user?.username,
      prevImageId: session?.user?.avatar?.fileId,
    });
    if (uploadResponse) {
      const { avatar } = uploadResponse;
      if (!avatar) {
        toast.error(uploadResponse.message);
        return;
      }
      const response = await axios.post("/api/update-avatar", {
        avatar,
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      await update({ avatar: response.data.avatar });
      toast.success(response.data.message);
    }
  };

  return (
    <Card className="p-6 border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl relative overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-md hover:shadow-primary/2 group">
      <div className="absolute top-0 right-0 size-24 bg-primary/3 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-primary/6" />

      <h3 className="font-heading font-bold text-base mb-6 flex items-center gap-2 text-foreground/90">
        <Ghost className="w-4 h-4 text-primary" />
        Account Profile
      </h3>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative group/avatar">
          <DropZone
            avatar={session?.user?.avatar}
            selectedFile={selectedFile}
            onFileChange={(file) => setSelectedFile(file)}
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">
            {session?.user?.name || session?.user?.username}
          </h2>
          <p className="text-sm text-muted-foreground font-mono">
            @{session?.user?.username}
          </p>
        </div>

        {selectedFile && (
          <Button
            className="w-full py-2.5 rounded-xl cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg transition-all"
            onClick={handleUpdateAvatar}
          >
            Save Changes
          </Button>
        )}
      </div>
    </Card>
  );
}

function ShareBoardCard({ session }: { session: Session | null }) {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [profileLink, setProfileLink] = useState<string>("");

  useEffect(() => {
    if (!session?.user?.username) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const absoluteLink = `${baseUrl}/u/${session.user.username}/`;
    setProfileLink(absoluteLink);

    QRCode.toDataURL(
      absoluteLink,
      { errorCorrectionLevel: "H", margin: 2, type: "image/png" },
      (err, url) => {
        if (err) {
          console.error("Error generating QR Code:", err);
          return;
        }
        setQrUrl(url);
      },
    );
  }, [session?.user?.username]);

  const copyToClipboard = () => {
    if (!profileLink) return;
    navigator.clipboard.writeText(profileLink);
    toast.success("Profile URL copied to clipboard!");
  };

  const handleShare = async () => {
    if (!profileLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AnoniMessage",
          text: "Send me anonymous messages!",
          url: profileLink,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card className="p-6 border border-border/50 bg-card/40 backdrop-blur-md rounded-3xl relative overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-md hover:shadow-primary/2 group">
      <div className="absolute top-0 right-0 size-24 bg-primary/3 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-primary/6" />

      <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2 text-foreground/90">
        <Share2 className="w-4 h-4 text-primary" />
        Share Messages Board
      </h3>

      <div className="flex flex-col sm:flex-row lg:flex-col gap-6 items-center">
        {/* QR Code Container */}
        <div className="relative group/qr shrink-0 shadow-md border border-border/20 size-40 flex items-center justify-center transition-transform duration-300 hover:scale-102">
          {qrUrl ? (
            <Image src={qrUrl} alt="QR Code" width={200} height={200} />
          ) : (
            <div className="size-full flex items-center justify-center text-xs text-muted-foreground font-mono">
              Generating...
            </div>
          )}
        </div>

        {/* Sharing Details */}
        <div className="flex-1 w-full space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Allow people to send you anonymous messages! Copy your dashboard
            link or display this custom QR code on your profiles.
          </p>

          <div className="relative flex items-center">
            <div className="w-full bg-muted/40 border border-border/80 px-3.5 py-2.5 pr-12 rounded-xl text-xs font-mono text-muted-foreground truncate select-all">
              {profileLink || "Loading your link..."}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 w-8 h-8 rounded-lg shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer"
              onClick={copyToClipboard}
              disabled={!profileLink}
              title="Copy Link"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Share Action Grid */}
          <div className="flex items-center gap-2 pt-1 justify-start">
            <a
              href={
                profileLink
                  ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileLink)}&text=${encodeURIComponent("Send me anonymous messages!")}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center rounded-xl size-10 border border-border bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200",
                !profileLink && "pointer-events-none opacity-50",
              )}
              title="Share on X"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a
              href={
                profileLink
                  ? `https://api.whatsapp.com/send?text=${encodeURIComponent("Send me anonymous messages! " + profileLink)}`
                  : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center rounded-xl size-10 border border-border bg-card hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all duration-200",
                !profileLink && "pointer-events-none opacity-50",
              )}
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <Button
              size="icon"
              variant="outline"
              className="rounded-xl size-10 border-border bg-card hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30 transition-all duration-200 cursor-pointer"
              onClick={handleShare}
              disabled={!profileLink}
              title="Share Sheet"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
