"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, UserX, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const FEATURES_LIST = [
  {
    icon: UserX,
    title: "Full Anonymity",
    desc: "Senders are always 100% anonymous. No tracking, no IP logging.",
  },
  {
    icon: Zap,
    title: "Shareable Link",
    desc: "One link. Anyone can message you, no account needed to send.",
  },
  {
    icon: Brain,
    title: "AI Suggestions",
    desc: "Stuck? Let AI suggest interesting questions for your visitors to ask.",
  },
];

const STEPS_LIST = [
  {
    number: "1",
    title: "Create Account",
    desc: "Claim your unique username.",
  },
  {
    number: "2",
    title: "Share Link",
    desc: "Post it on your socials.",
  },
  {
    number: "3",
    title: "Get Messages",
    desc: "Read anonymous thoughts.",
  },
  {
    number: "4",
    title: "Respond",
    desc: "Share on your stories.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen transition-all">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Badge
            variant="outline"
            className="mb-6 border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 h-auto text-sm rounded-full"
          >
            <span className="flex h-2 w-2 rounded-full bg-success mr-2 animate-pulse" />
            Anonymity guaranteed
          </Badge>

          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-secondary via-primary to-blue-500">
            Real thoughts.
            <br />
            Zero identity.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
            Share your link. Get brutally honest, anonymous messages from
            anyone. No tracking. No signup required for senders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 rounded-xl px-6 text-lg">
                Create Your Board <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={(e) => {
                const element = document.getElementById("how-it-works");
                if (element) {
                  e.preventDefault();
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  router.push("/#how-it-works");
                }
              }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="h-14 px-6 text-muted-foreground text-lg hover:bg-accent"
              >
                See how it works
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Mockup area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative w-full max-w-2xl mx-auto perspective-1000"
        >
          <div className="relative transform rotate-x-12 rotate-y-[-5deg] rotate-z-2 shadow-2xl rounded-2xl border border-white/10 bg-card overflow-hidden">
            <div className="h-10 border-b border-white/5 bg-background/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <div className="p-8 pb-12 flex flex-col gap-4 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]">
              <Card className="w-full p-4 border-primary/30 shadow-[0_0_20px_rgba(124,58,237,0.2)] ml-auto max-w-md hover:-translate-y-1 hover:shadow-none transition-all">
                <p className="text-sm">
                  "Your new project looks absolutely incredible. How did you
                  learn to design like that? 🤩"
                </p>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  Just now • Anonymous
                </div>
              </Card>
              <Card className="w-full p-4 mr-auto max-w-md bg-accent/50 shadow-[0_0_20px_rgba(124,58,237,0.1)] hover:-translate-y-1 hover:shadow-none transition-all">
                <p className="text-sm">
                  "Honestly, I think you're overworking yourself. Take a break!"
                </p>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  2h ago • Anonymous
                </div>
              </Card>
              <Card className="w-full p-4 ml-auto max-w-md border-secondary/20 shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:-translate-y-1 hover:shadow-none transition-all">
                <p className="text-sm">
                  "I have a massive crush on you but I'm too scared to say it
                  🫣"
                </p>
                <div className="text-xs text-muted-foreground mt-2 font-mono">
                  Yesterday • Anonymous
                </div>
              </Card>
            </div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -right-8 top-12 bg-card p-3 rounded-2xl shadow-xl border border-white/5 backdrop-blur-md rotate-12"
          >
            <span className="text-xl">😂</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -left-12 bottom-20 bg-card p-3 rounded-2xl shadow-xl border border-white/5 backdrop-blur-md rotate-[-15deg]"
          >
            <span className="text-xl">✨</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 bg-white/2">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Join <strong className="text-foreground">50,000+</strong> users
            already getting honest messages
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Everything you need to hear the truth.
          </h2>
          <p className="text-muted-foreground">
            Powerful features wrapped in a minimal, gorgeous interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
            />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-24 bg-card border-y border-white/5"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-12">
            How it Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-white/5 -translate-y-1/2" />
            {STEPS_LIST.map((step) => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                desc={step.desc}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-background/50 border-white/5 p-6 hover:border-primary/30 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </Card>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center flex-1 relative z-10 w-full md:w-auto">
      <div className="w-12 h-12 rounded-full bg-card border-2 border-primary text-primary font-bold flex items-center justify-center mb-4 text-xl shadow-[0_0_15px_rgba(124,58,237,0.3)]">
        {number}
      </div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground text-center">{desc}</p>
    </div>
  );
}
