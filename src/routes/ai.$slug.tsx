import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft, ExternalLink, Calendar, Building2, Sparkles, Bot,
  Image as ImageIcon, Video, Music, Clock, Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AI_TOOL_BY_SLUG, CAT_COLOR, type AICategory } from "@/lib/ai-tools";
import { applyPromptVisibility } from "@/lib/prompt-visibility";
import { PromptCard, PromptCardSkeleton, type PromptListItem } from "@/components/prompt-card";
import { LoadError } from "@/components/load-error";
import { useAuth } from "@/hooks/use-auth";

const CAT_ICON: Record<AICategory, typeof Bot> = { Text: Bot, Image: ImageIcon, Video, Audio: Music };

export const Route = createFileRoute("/ai/$slug")({
  beforeLoad: ({ params }) => {
    if (!AI_TOOL_BY_SLUG[params.slug]) throw notFound();
  },
  component: AIToolPage,
  head: ({ params }) => {
    const t = AI_TOOL_BY_SLUG[params.slug];
    if (!t) return { meta: [{ title: "AI Tool — Prompt Vault" }] };
    return {
      meta: [
        { title: `${t.name} prompts — by ${t.company} | Prompt Vault` },
        { name: "description", content: `${t.tagline} ${t.description}` },
        { property: "og:title", content: `${t.name} — ${t.company}` },
        { property: "og:description", content: t.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-3xl font-bold">AI tool not found</h1>
      <p className="mt-2 text-muted-foreground">We don't have a page for that tool yet.</p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        <ArrowLeft className="h-4 w-4" /> Back home
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-2xl font-bold">Something broke</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function AIToolPage() {
  const { slug } = Route.useParams();
  const tool = AI_TOOL_BY_SLUG[slug]!;
  const Icon = CAT_ICON[tool.cat];
  const catColor = CAT_COLOR[tool.cat];
  const { isAdmin } = useAuth();

  // Live clock for the visitor — gives the page a "time stamp" feel.
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("admin_settings").select("settings").eq("id", 1).maybeSingle();
      return (data?.settings ?? {}) as { site_name?: string; default_pin?: string };
    },
    staleTime: 5 * 60 * 1000,
  });
  const defaultPin = settings?.default_pin || "00000";

  const { data: prompts, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["ai-prompts", tool.name, isAdmin],
    queryFn: async () => {
      let q: any = supabase
        .from("prompts")
        .select("id,slug,title,description,content,difficulty,ai_models,is_locked,is_featured,view_count,copy_count,rating_avg,pin_hash,categories(name,color)")
        .contains("ai_models", [tool.name])
        .order("view_count", { ascending: false })
        .limit(60);
      q = applyPromptVisibility(q, { includeLocked: false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as PromptListItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: tool.color }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: catColor }}
        />

        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>

          <div className="mt-8 flex flex-col items-center text-center">
            {/* Animated logo tile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-3xl blur-2xl opacity-60"
                style={{ backgroundColor: tool.color }}
              />
              <div
                className="relative grid h-28 w-28 place-items-center rounded-3xl border border-white/10 backdrop-blur-xl text-3xl font-bold tracking-tight"
                style={{
                  backgroundColor: `${tool.color.replace(")", " / 0.18)").replace("oklch(", "oklch(")}`,
                  color: tool.color,
                  boxShadow: `0 20px 60px -20px ${tool.color}`,
                }}
              >
                {tool.initials}
              </div>
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-[2rem] border border-dashed opacity-30"
                style={{ borderColor: tool.color }}
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm"
              style={{ color: catColor }}
            >
              <Icon className="h-3 w-3" /> {tool.cat} AI
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight"
            >
              {tool.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-3 text-lg text-muted-foreground max-w-xl"
            >
              {tool.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground/90"
            >
              {tool.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
              >
                Visit {tool.name} <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                to="/"
                search={{ ai: tool.name }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                <Sparkles className="h-4 w-4" /> Filter all prompts
              </Link>
            </motion.div>

            {/* Meta row: company / founded / live clock */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <MetaCell
                icon={Building2}
                label="Made by"
                value={tool.company}
                accent={tool.color}
              />
              <MetaCell
                icon={Calendar}
                label="Launched"
                value={String(tool.founded)}
                accent={tool.color}
              />
              <MetaCell
                icon={Clock}
                label="Right now"
                value={now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                accent={tool.color}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROMPTS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Prompts for {tool.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {prompts?.length ?? 0} curated prompt{(prompts?.length ?? 0) === 1 ? "" : "s"} — sorted by popularity.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <PromptCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <LoadError
            title="Couldn't load prompts"
            message={(error as Error)?.message}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : prompts && prompts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
              >
                <PromptCard p={p} defaultPin={defaultPin} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="vault-card rounded-xl p-12 text-center">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold">No prompts yet for {tool.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon — or browse the full vault.</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/40">
              Browse all prompts
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function MetaCell({
  icon: Icon, label, value, accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="vault-card rounded-xl px-4 py-4 flex items-center gap-3 text-left">
      <div
        className="grid h-10 w-10 place-items-center rounded-lg shrink-0"
        style={{ backgroundColor: `${accent.replace(")", " / 0.15)")}`, color: accent }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold truncate tabular-nums">{value}</div>
      </div>
    </div>
  );
}