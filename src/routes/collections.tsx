import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Layers, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
  head: () => ({
    meta: [
      { title: "Collections — Curated Prompt Bundles" },
      { name: "description", content: "Browse themed bundles of AI prompts: Marketing Pack, Coding Essentials, and more." },
      { property: "og:title", content: "Collections — Curated Prompt Bundles" },
      { property: "og:description", content: "Themed bundles of AI prompts to jump-start your workflow." },
    ],
  }),
});

function CollectionsPage() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["public-collections"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("id,slug,name,description,cover_image_url,accent_color,icon,is_featured,collection_prompts(prompt_id)")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Curated Bundles
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight">Prompt Collections</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Themed packs of hand-picked prompts. Grab a whole workflow in one place.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vault-card rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : collections && collections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c: any, i) => {
            const count = c.collection_prompts?.length ?? 0;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  to="/c/$slug"
                  params={{ slug: c.slug }}
                  className="vault-card group block rounded-2xl p-6 hover:shadow-glow transition-all hover:-translate-y-1 h-full relative overflow-hidden"
                  style={{ borderColor: `${c.accent_color}40` }}
                >
                  <div
                    aria-hidden
                    className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-20 blur-3xl"
                    style={{ backgroundColor: c.accent_color }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                        style={{ backgroundColor: `${c.accent_color}20`, color: c.accent_color }}
                      >
                        {c.icon || <Layers className="h-5 w-5" />}
                      </div>
                      {c.is_featured && (
                        <span className="text-[10px] uppercase tracking-wider rounded-full bg-accent/15 text-accent px-2 py-0.5">Featured</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{c.name}</h2>
                    {c.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{c.description}</p>}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{count} prompt{count === 1 ? "" : "s"}</span>
                      <span className="inline-flex items-center gap-1 font-medium" style={{ color: c.accent_color }}>
                        Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="vault-card rounded-2xl py-16 px-6 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Collections coming soon</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We&apos;re curating themed bundles like Marketing Pack & Coding Essentials. In the meantime, explore all prompts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Browse all prompts <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
            >
              Back to home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}