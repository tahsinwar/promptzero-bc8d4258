import { useState } from "react";
import type { AITool } from "@/lib/ai-tools";

export function AILogo({
  tool,
  size = 28,
  className = "",
}: {
  tool: Pick<AITool, "name" | "logo" | "color" | "initials">;
  size?: number;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    tool.logo ? "loading" : "error",
  );

  if (status === "error" || !tool.logo) {
    return (
      <span
        aria-label={`${tool.name} logo`}
        className={`grid place-items-center font-bold ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          color: tool.color,
        }}
      >
        {tool.initials}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {status === "loading" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded-md bg-foreground/10"
        />
      )}
      <img
        src={`https://cdn.simpleicons.org/${tool.logo}`}
        alt={`${tool.name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          opacity: status === "loaded" ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      />
    </span>
  );
}