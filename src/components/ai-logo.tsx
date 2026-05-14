import { useState } from "react";
import type { AITool } from "@/lib/ai-tools";

export function AILogo({
  tool,
  size = 28,
  className = "",
}: {
  tool: Pick<AITool, "name" | "logo" | "color" | "initials" | "company">;
  size?: number;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    tool.logo ? "loading" : "error",
  );

  const tooltip = tool.company ? `${tool.name} — ${tool.company}` : tool.name;
  const a11yLabel = tool.company
    ? `${tool.name} logo, by ${tool.company}`
    : `${tool.name} logo`;

  if (status === "error" || !tool.logo) {
    return (
      <span
        role="img"
        aria-label={a11yLabel}
        title={tooltip}
        className={`grid place-items-center rounded-md bg-foreground text-background font-bold ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
        }}
      >
        {tool.initials}
      </span>
    );
  }

  return (
    <span
      role="img"
      title={tooltip}
      aria-label={a11yLabel}
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
        alt=""
        aria-hidden="true"
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