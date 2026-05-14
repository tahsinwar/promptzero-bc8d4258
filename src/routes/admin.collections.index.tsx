import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { slugify } from "@/lib/slug";
import { Plus, Trash2, Loader2, Pencil, Eye, EyeOff, Star, Layers } from "lucide-react";
import { toast } from "sonner";
import { AdminListSkeleton } from "@/components/admin-skeletons";

export const Route = createFileRoute("/admin/collections/")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#6366f1");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-collections"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*, collection_prompts(prompt_id)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("collections").insert({
        name,
        slug: slug || slugify(name),
        accent_color: color,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName(""); setSlug("");
      qc.invalidateQueries({ queryKey: ["admin-collections"] });
      toast.success("Collection created");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("collections").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-collections"] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("collections").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-collections"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-collections"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layers className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Collections</h1>
      </div>
      <p className="text-muted-foreground -mt-3 text-sm">Bundle prompts into themed packs (e.g. Marketing Pack, Coding Essentials).</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(); }}
        className="vault-card rounded-xl p-4 flex flex-wrap gap-3 items-center"
      >
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }}
          placeholder="Collection name"
          maxLength={80}
          className="flex-1 min-w-[180px] rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="slug (auto)"
          maxLength={80}
          className="flex-1 min-w-[160px] rounded-lg border border-border bg-input/40 px-3 py-2 text-sm font-mono outline-none focus:border-primary"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-14 rounded-lg border border-border bg-transparent cursor-pointer"
        />
        <button disabled={create.isPending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create
        </button>
      </form>

      {isLoading && !data ? <AdminListSkeleton rows={4} /> : (
        <div className="space-y-2">
          {data?.map((c: any) => {
            const count = c.collection_prompts?.length ?? 0;
            return (
              <div key={c.id} className="vault-card rounded-lg p-3 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-md shrink-0 grid place-items-center text-white font-bold"
                  style={{ backgroundColor: c.accent_color }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{c.name}</span>
                    {!c.is_published && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full bg-muted px-2 py-0.5 text-muted-foreground">Draft</span>
                    )}
                    {c.is_featured && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full bg-accent/15 text-accent px-2 py-0.5">Featured</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">/c/{c.slug} · {count} prompt{count === 1 ? "" : "s"}</div>
                </div>
                <button
                  onClick={() => toggleFeatured.mutate({ id: c.id, is_featured: !c.is_featured })}
                  className={`rounded-md p-2 ${c.is_featured ? "text-accent" : "text-muted-foreground hover:text-foreground"} hover:bg-secondary`}
                  title={c.is_featured ? "Unfeature" : "Feature"}
                >
                  <Star className="h-4 w-4" fill={c.is_featured ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => togglePublish.mutate({ id: c.id, is_published: !c.is_published })}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  title={c.is_published ? "Unpublish" : "Publish"}
                >
                  {c.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <Link
                  to="/admin/collections/$id"
                  params={{ id: c.id }}
                  className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  disabled={remove.isPending}
                  onClick={() => confirm(`Delete "${c.name}"?`) && remove.mutate(c.id)}
                  className="rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-secondary disabled:opacity-60"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {data && data.length === 0 && <p className="text-muted-foreground text-sm">No collections yet. Create your first bundle above.</p>}
        </div>
      )}
    </div>
  );
}