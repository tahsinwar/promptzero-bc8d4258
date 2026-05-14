import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Send, MessageCircle, Github, Twitter, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us — Prompt Vault" },
      { name: "description", content: "Get in touch with the Prompt Vault team. Send us feedback, ideas, or partnership requests." },
      { property: "og:title", content: "Contact Us — Prompt Vault" },
      { property: "og:description", content: "Get in touch with the Prompt Vault team." },
    ],
  }),
});

const CONTACT_EMAIL = "hello@promptzero.com";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  subject: z.string().trim().min(1, "Subject is required").max(150, "Subject must be under 150 characters"),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [sending, setSending] = useState(false);

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof typeof form;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors below");
      return;
    }
    setSending(true);
    const { name, email, subject, message } = result.data;
    const body = `From: ${name} <${email}>\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening your email client…");
    }, 600);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="orb orb-primary -top-32 -right-20 h-[400px] w-[400px]" />
        <div aria-hidden className="orb orb-accent top-20 -left-24 h-[450px] w-[450px]" />
        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> We're listening
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight"
          >
            Get in <span className="gradient-text-animated">touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Questions, feedback, prompt requests — drop us a line and we'll get back to you.
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <form onSubmit={onSubmit} className="vault-card rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  maxLength={100}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxLength={255}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>
            <Field label="Subject" error={errors.subject}>
              <input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                maxLength={150}
                placeholder="What's this about?"
                className="w-full rounded-lg border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Message" error={errors.message} hint={`${form.message.length}/2000`}>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                maxLength={2000}
                rows={7}
                placeholder="Tell us what's on your mind…"
                className="w-full rounded-lg border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
              />
            </Field>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send message
            </button>
          </form>

          {/* Sidebar info */}
          <aside className="space-y-4">
            <InfoCard
              icon={Mail}
              title="Email us directly"
              desc={CONTACT_EMAIL}
              href={`mailto:${CONTACT_EMAIL}`}
            />
            <InfoCard
              icon={MessageCircle}
              title="Have a question on a prompt?"
              desc="Use the Q&A box on any prompt page — we answer there too."
            />
            <div className="vault-card rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">Find us online</h3>
              <div className="flex gap-2">
                <a
                  href="https://github.com/tahsinwar"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="vault-card rounded-xl p-5 bg-primary/5 border-primary/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Response time:</strong> We typically reply within 24–48 hours.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({
  label, error, hint, children,
}: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </label>
  );
}

function InfoCard({
  icon: Icon, title, desc, href,
}: { icon: typeof Mail; title: string; desc: string; href?: string }) {
  const inner = (
    <>
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{desc}</div>
      </div>
    </>
  );
  return href ? (
    <a href={href} className="vault-card rounded-xl p-4 flex items-center gap-3 hover:border-primary/40 transition-colors">{inner}</a>
  ) : (
    <div className="vault-card rounded-xl p-4 flex items-center gap-3">{inner}</div>
  );
}