import { useRouterState } from "@tanstack/react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const SHOW_DELAY = 150; // don't flash for fast ops
const MIN_VISIBLE = 300; // once visible, stay at least this long

export function GlobalLoader() {
  const isNavigating = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const busy = isNavigating || isFetching > 0 || isMutating > 0;

  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (busy) {
      if (!visible) {
        showTimer = setTimeout(() => {
          shownAtRef.current = Date.now();
          setVisible(true);
        }, SHOW_DELAY);
      }
    } else if (visible) {
      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, MIN_VISIBLE - elapsed);
      hideTimer = setTimeout(() => setVisible(false), remaining);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [busy, visible]);

  if (!visible) return null;
  return (
    <>
      {/* Top progress bar — glowing shimmer */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        <div
          className="absolute inset-y-0 w-1/2 animate-[loader-slide_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.8))" }}
        />
      </div>

      {/* Bottom-right premium pill */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] animate-[loader-rise_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="relative">
          {/* outer glow */}
          <div className="absolute -inset-px rounded-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 opacity-70 blur-md" />
          <div className="relative flex items-center gap-2.5 rounded-full border border-primary/20 bg-background/70 px-3.5 py-2 text-xs font-medium text-foreground/80 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.35)] backdrop-blur-xl">
            {/* dual-ring spinner */}
            <span className="relative inline-flex h-3.5 w-3.5">
              <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/70 animate-spin"
                style={{ animationDuration: "0.85s" }}
              />
              <span className="absolute inset-1 rounded-full bg-primary/30 animate-pulse" />
            </span>
            <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent tracking-wide">
              Loading
            </span>
            {/* shimmer dot trio */}
            <span className="flex items-center gap-0.5 ml-0.5">
              <span className="h-1 w-1 rounded-full bg-primary/70 animate-[loader-dot_1.2s_ease-in-out_infinite]" />
              <span className="h-1 w-1 rounded-full bg-primary/70 animate-[loader-dot_1.2s_ease-in-out_0.15s_infinite]" />
              <span className="h-1 w-1 rounded-full bg-primary/70 animate-[loader-dot_1.2s_ease-in-out_0.3s_infinite]" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
