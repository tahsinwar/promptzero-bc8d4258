import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Layers, Sparkles } from "lucide-react";
import { PromptCard, type PromptListItem } from "@/components/prompt-card";
import { isPromptVisible } from "@/lib/prompt-visibility";

export const Route = createFileRoute("/c/$slug")({
  component: CollectionDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Collection — ${params.slug}` },
      { property: "og:title", content: `Collection — ${params.slug}` },
    ],
  }),
});

function CollectionDetail() {
  const { slug } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["collection-detail", slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data: collection, error: e1 } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (e1) throw e1;
      if (!collection) throw notFound();

      const { data: rows, error: e2 } = await supabase
        .from("collection_prompts")
        .select("display_order,prompts(id,slug,title,description,content,difficulty,ai_models,is_locked,is_featured,view_count,copy_count,rating_avg,pin_hash,categories(name,color))")
        .eq("collection_id", collection.id)
        .order("display_order", { ascending: true });
      if (e2) throw e2;

      const prompts = (rows ?? [])
        .map((r: any) => r.prompts)
        .filter(Boolean)
        .filter((p: any) => isPromptVisible(p)) as unknown as PromptListItem[];

      return { collection, prompts };
    },
  });

  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("admin_settings").select("settings").eq("id", 1).maybeSingle();
      return (data?.settings ?? {}) as { default_pin?: string };
    },
    staleTime: 5 * 60 * 1000,
  });
  const defaultPin = settingsData?.default_pin || "00000";

  if (isLoading) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground">Loading…</div>;
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-muted-foreground mb-4">Collection not found.</p>
        <Link to="/collections" className="text-primary text-sm">← All collections</Link>
      </div>
    );
  }

  const { collection, prompts } = data;
  const accent = collection.accent_color || "#6366f1";

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: `linear-gradient(180deg, ${accent}1a 0%, transparent 100%)` }}
      >
        <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: accent }} />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
          <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> All collections
          </Link>
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-2xl text-4xl mb-6"
            style={{ backgroundColor: `${accent}25`, color: accent }}
          >
            {collection.icon || <Layers className="h-8 w-8" />}
          </div>
          {collection.is_featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent mb-3">
              <Sparkles className="h-3 w-3" /> Featured Collection
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{collection.name}</h1>
          {collection.description && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{collection.description}</p>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            {prompts.length} prompt{prompts.length === 1 ? "" : "s"} in this bundle
          </p>
        </div>
      </section>

      {/* Prompts */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {prompts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p) => (
              <PromptCard key={p.id} p={p} defaultPin={defaultPin} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No prompts in this collection yet.</p>
        )}
      </section>
    </div>
  );
}