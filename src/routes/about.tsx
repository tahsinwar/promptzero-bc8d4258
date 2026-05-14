import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Vault, Layers, Lock, Heart, ArrowRight, Bot, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — Prompt Vault" },
      { name: "description", content: "Learn about Prompt Vault — a curated home for the best AI prompts across ChatGPT, Claude, Midjourney and more." },
      { property: "og:title", content: "About Us — Prompt Vault" },
      { property: "og:description", content: "A curated home for the best AI prompts." },
    ],
  }),
});

const VALUES = [
  { icon: Sparkles, title: "Curated Quality", desc: "Every prompt is hand-picked, tested, and refined — no AI-generated filler." },
  { icon: Layers, title: "Themed Bundles", desc: "Grab whole workflows at once with collections like Marketing Pack and Coding Essentials." },
  { icon: Lock, title: "Premium Vault", desc: "Locked prompts for exclusive content with secure PIN access." },
  { icon: Bot, title: "Multi-Tool Ready", desc: "Optimized for ChatGPT, Claude, Gemini, Midjourney, and 20+ AI tools." },
  { icon: Zap, title: "Fast & Free", desc: "One-click copy. No signups. Use any prompt instantly." },
  { icon: Users, title: "Community Driven", desc: "Comments, ratings, and questions help every prompt get better over time." },
];

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="orb orb-primary -top-32 -left-20 h-[400px] w-[400px]" />
        <div aria-hidden className="orb orb-accent top-20 -right-24 h-[450px] w-[450px]" />
        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight"
          >
            Built for people who <span className="gradient-text-animated">love prompts</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Prompt Vault is a curated library of high-quality AI prompts — designed for creators,
            developers, marketers, and anyone who works with AI every day.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="vault-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary mb-5">
              <Vault className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Great AI output starts with a great prompt. We built Prompt Vault to make
              the world's best prompts accessible in one beautifully organized place — searchable,
              shareable, and ready to use. No fluff, no paywalls for the basics, just prompts that work.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">What makes us different</h2>
          <p className="mt-3 text-muted-foreground">Quality over quantity, every single time.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              className="vault-card rounded-xl p-6 hover:-translate-y-1 transition-transform"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary mb-4">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="vault-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative">
            <Heart className="h-10 w-10 mx-auto text-accent fill-accent/30 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Have an idea or feedback?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We'd love to hear from you. Reach out and tell us what prompts you wish existed.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}