import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/slug";
import { ArrowLeft, Loader2, Save, Plus, X, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/collections/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: collection, isLoading } = useQuery({
    queryKey: ["admin-collection", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: items, refetch: refetchItems } = useQuery({
    queryKey: ["admin-collection-prompts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_prompts")
        .select("display_order,prompt_id,prompts(id,title,slug,is_published,categories(name,color))")
        .eq("collection_id", id)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Local form state
  const [form, setForm] = useState({
    name: "", slug: "", description: "", cover_image_url: "", accent_color: "#6366f1", icon: "",
    is_published: true, is_featured: false, display_order: 0,
  });
  useEffect(() => {
    if (collection) {
      setForm({
        name: collection.name ?? "",
        slug: collection.slug ?? "",
        description: collection.description ?? "",
        cover_image_url: collection.cover_image_url ?? "",
        accent_color: collection.accent_color ?? "#6366f1",
        icon: collection.icon ?? "",
        is_published: !!collection.is_published,
        is_featured: !!collection.is_featured,
        display_order: collection.display_order ?? 0,
      });
    }
  }, [collection]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("collections").update({
        ...form,
        slug: form.slug || slugify(form.name),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-collection", id] });
      qc.invalidateQueries({ queryKey: ["admin-collections"] });
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Prompt picker
  const [search, setSearch] = useState("");
  const { data: searchResults } = useQuery({
    queryKey: ["admin-prompt-search", search],
    enabled: search.trim().length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("prompts")
        .select("id,title,slug,is_published")
        .ilike("title", `%${search}%`)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const existingIds = useMemo(() => new Set((items ?? []).map((x: any) => x.prompt_id)), [items]);

  const addPrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const nextOrder = (items?.length ?? 0);
      const { error } = await supabase.from("collection_prompts").insert({
        collection_id: id, prompt_id: promptId, display_order: nextOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => { refetchItems(); toast.success("Added"); },
    onError: (e: any) => toast.error(e.message),
  });

  const removePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from("collection_prompts")
        .delete()
        .eq("collection_id", id)
        .eq("prompt_id", promptId);
      if (error) throw error;
    },
    onSuccess: () => refetchItems(),
  });

  const move = useMutation({
    mutationFn: async ({ promptId, dir }: { promptId: string; dir: -1 | 1 }) => {
      const list = items ?? [];
      const idx = list.findIndex((x: any) => x.prompt_id === promptId);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= list.length) return;
      const a = list[idx]; const b = list[swap];
      await supabase.from("collection_prompts").update({ display_order: b.display_order }).eq("collection_id", id).eq("prompt_id", a.prompt_id);
      await supabase.from("collection_prompts").update({ display_order: a.display_order }).eq("collection_id", id).eq("prompt_id", b.prompt_id);
    },
    onSuccess: () => refetchItems(),
  });

  if (isLoading) {
    return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!collection) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Collection not found.</p>
        <Link to="/admin/collections" className="text-primary text-sm">← Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate({ to: "/admin/collections" })} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to collections
        </button>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>

      <h1 className="text-3xl font-bold">{form.name || "Untitled collection"}</h1>

      {/* Details */}
      <div className="vault-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} maxLength={80}
              className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>
          <Field label="Slug">
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} maxLength={80}
              className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm font-mono outline-none focus:border-primary" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} maxLength={500}
            className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Cover image URL">
            <input value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
              placeholder="https://…"
              className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>
          <Field label="Icon (emoji)">
            <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} maxLength={4}
              placeholder="✨"
              className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>
          <Field label="Accent color">
            <input type="color" value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))}
              className="h-10 w-full rounded-lg border border-border bg-transparent cursor-pointer" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <Toggle label="Published" checked={form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          <Toggle label="Featured" checked={form.is_featured} onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} />
          <Field label="Display order" className="w-32">
            <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>
        </div>
      </div>

      {/* Prompts in collection */}
      <div className="vault-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Prompts in this collection ({items?.length ?? 0})
          </h2>
        </div>

        <div className="space-y-2">
          {items?.map((row: any, i: number) => {
            const p = row.prompts;
            if (!p) return null;
            return (
              <div key={row.prompt_id} className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
                <div className="flex flex-col text-muted-foreground">
                  <button onClick={() => move.mutate({ promptId: row.prompt_id, dir: -1 })} disabled={i === 0} className="hover:text-foreground disabled:opacity-30 text-xs">▲</button>
                  <button onClick={() => move.mutate({ promptId: row.prompt_id, dir: 1 })} disabled={i === (items?.length ?? 0) - 1} className="hover:text-foreground disabled:opacity-30 text-xs">▼</button>
                </div>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{p.title}</span>
                    {!p.is_published && <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground uppercase">Draft</span>}
                    {p.categories && (
                      <span className="text-[10px] rounded px-1.5 py-0.5" style={{ backgroundColor: `${p.categories.color}22`, color: p.categories.color }}>
                        {p.categories.name}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">/p/{p.slug}</div>
                </div>
                <button onClick={() => removePrompt.mutate(row.prompt_id)} className="rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-secondary">
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {items && items.length === 0 && <p className="text-sm text-muted-foreground">No prompts yet. Search below to add some.</p>}
        </div>

        {/* Search & add */}
        <div className="border-t border-border pt-4">
          <label className="relative block mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts to add…"
              className="w-full rounded-lg border border-border bg-input/40 pl-10 pr-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          {search && (
            <div className="space-y-1 max-h-72 overflow-auto">
              {searchResults?.filter((p) => !existingIds.has(p.id)).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addPrompt.mutate(p.id)}
                  className="w-full text-left flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-secondary/60 transition-colors"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate">{p.title}</span>
                  {!p.is_published && <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground uppercase">Draft</span>}
                </button>
              ))}
              {searchResults && searchResults.length === 0 && <p className="text-xs text-muted-foreground px-3">No matches.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span className="relative inline-flex h-5 w-9 items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
        <span className="relative h-4 w-4 rounded-full bg-background translate-x-0.5 peer-checked:translate-x-[18px] transition-transform" />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}