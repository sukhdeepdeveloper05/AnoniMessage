"use client";

import { usePathname } from "next/navigation";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isVerify = pathname.startsWith("/verify");

  // Only apply the split layout for sign-in and sign-up
  const isSplitLayout = pathname === "/sign-in" || pathname === "/sign-up";

  if (!isSplitLayout) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const type = pathname === "/sign-in" ? "sign-in" : "sign-up";

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* 
        We use a flex container but animate the order/position. 
        Actually, it's easier to just use flex-row vs flex-row-reverse 
        and let Framer Motion animate the layout change if we use the layout prop.
      */}
      <motion.div
        layout
        transition={{ duration: 0.1, ease: "easeOut" }}
        className={`w-full min-h-screen flex ${type === "sign-in" ? "flex-row-reverse" : "flex-row"}`}
      >
        <motion.div layout className="hidden lg:flex w-1/2 h-full">
          <AuthBranding type={type} />
        </motion.div>

        <motion.div
          layout
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background h-full"
        >
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
