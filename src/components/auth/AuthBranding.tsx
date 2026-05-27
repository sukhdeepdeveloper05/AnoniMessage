import { Ghost, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthBrandingProps {
  type: "sign-in" | "sign-up";
}

export function AuthBranding({ type }: AuthBrandingProps) {
  const isSignIn = type === "sign-in";

  return (
    <div
      className={`hidden lg:flex w-full bg-card relative overflow-hidden flex-col justify-between p-12 border-white/5 ${
        isSignIn ? "border-l" : "border-r"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_${
          isSignIn ? "right" : "left"
        },var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50`}
      />

      <div className={`flex ${isSignIn ? "justify-end" : "justify-start"} w-full`}>
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-heading font-bold text-foreground relative z-10 w-fit"
        >
          {isSignIn ? (
            <>
              AnoniMessage
              <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                <Ghost className="w-6 h-6 text-secondary" />
              </div>
            </>
          ) : (
            <>
              <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                <Ghost className="w-6 h-6 text-secondary" />
              </div>
              AnoniMessage
            </>
          )}
        </Link>
      </div>

      <motion.div
        key={type}
        initial={{ opacity: 0, x: isSignIn ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`relative z-10 max-w-md ${isSignIn ? "ml-auto text-right" : ""}`}
      >
        <h2 className="text-4xl font-heading font-bold mb-4 tracking-tight">
          {isSignIn ? "Welcome back." : "Real thoughts. Zero identity."}
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          {isSignIn
            ? "Log in to see what people are saying behind your back (in a good way)."
            : "Create your board and start receiving honest, anonymous feedback from your friends and followers today."}
        </p>

        <div className="bg-background/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md text-left">
          {isSignIn ? (
            <>
              <div className="bg-card rounded-xl p-4 border border-white/5 shadow-lg relative mb-4">
                <p className="text-sm">"I'm so glad we met. You're an inspiration ✨"</p>
                <div className="absolute -left-3 -bottom-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-4">
                <div className="text-right">
                  <div className="text-sm font-semibold">Your Board</div>
                  <div className="text-xs text-muted-foreground">3 new messages</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-secondary to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-blue-500" />
                <div>
                  <div className="text-sm font-semibold">Alex's Board</div>
                  <div className="text-xs text-muted-foreground">anonimessage.com/u/alex</div>
                </div>
              </div>
              <div className="bg-card rounded-xl p-4 border border-white/5 shadow-lg relative">
                <p className="text-sm">"Your new style is amazing! Keep it up 🔥"</p>
                <div className="absolute -right-3 -bottom-3 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
