import { useState } from "react";
import type { AITool } from "@/lib/ai-tools";

/**
 * Renders the brand logo for an AI tool via simpleicons.org CDN.
 * Falls back to the tool's initials chip if the logo slug 404s
 * or the tool has no logo configured.
 */
export function AILogo({
  tool,
  size = 28,
  className = "",
}: {
  tool: Pick<AITool, "name" | "logo" | "color" | "initials">;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (tool.logo && !failed) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${tool.logo}`}
        alt={`${tool.name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

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