import { Ghost } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-xl font-heading font-bold text-foreground opacity-80">
          <Ghost className="w-5 h-5" /> AnoniMessage
        </div>
        <p className="text-sm text-muted-foreground">
          Real thoughts. Zero identity.
        </p>
        <div className="text-sm text-muted-foreground">© 2026 AnoniMessage</div>
      </div>
    </footer>
  );
};

export default Footer;
