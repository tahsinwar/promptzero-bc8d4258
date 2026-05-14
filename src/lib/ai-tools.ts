// Metadata for every AI tool the home page surfaces.
// Used by the home grid AND the dedicated /ai/$slug page.

export type AICategory = "Text" | "Image" | "Video" | "Audio";

export type AITool = {
  name: string;          // canonical name, also stored inside prompts.ai_models[]
  slug: string;          // URL-safe identifier
  cat: AICategory;
  company: string;       // owner / maker
  website: string;
  founded: number;       // year the tool launched
  tagline: string;
  description: string;
  color: string;         // brand-ish accent (oklch)
  initials: string;      // 1-2 chars used inside the logo tile
};

export const AI_TOOLS: AITool[] = [
  { name: "ChatGPT", slug: "chatgpt", cat: "Text", company: "OpenAI", website: "https://chatgpt.com", founded: 2022,
    tagline: "Conversational reasoning at scale.",
    description: "OpenAI's flagship chat assistant — versatile for writing, coding, analysis and brainstorming.",
    color: "oklch(0.74 0.15 165)", initials: "GP" },
  { name: "Claude", slug: "claude", cat: "Text", company: "Anthropic", website: "https://claude.ai", founded: 2023,
    tagline: "Thoughtful, long-context writing partner.",
    description: "Anthropic's assistant focused on safety, nuance and large document reasoning.",
    color: "oklch(0.74 0.16 55)", initials: "CL" },
  { name: "Gemini", slug: "gemini", cat: "Text", company: "Google DeepMind", website: "https://gemini.google.com", founded: 2023,
    tagline: "Multimodal model from Google.",
    description: "Google's frontier model — strong at multimodal input, search-augmented answers and reasoning.",
    color: "oklch(0.72 0.18 250)", initials: "GE" },
  { name: "Grok", slug: "grok", cat: "Text", company: "xAI", website: "https://grok.com", founded: 2023,
    tagline: "Realtime, irreverent assistant from xAI.",
    description: "xAI's chat model with live web context and a more candid tone.",
    color: "oklch(0.78 0.05 250)", initials: "GK" },
  { name: "Perplexity", slug: "perplexity", cat: "Text", company: "Perplexity AI", website: "https://perplexity.ai", founded: 2022,
    tagline: "Answer engine with citations.",
    description: "Search-first assistant that returns sourced, cited answers across the live web.",
    color: "oklch(0.74 0.15 200)", initials: "PX" },
  { name: "Mistral", slug: "mistral", cat: "Text", company: "Mistral AI", website: "https://mistral.ai", founded: 2023,
    tagline: "Open-weight European frontier models.",
    description: "Paris-based lab shipping efficient open-weight LLMs and the Le Chat assistant.",
    color: "oklch(0.72 0.18 30)", initials: "MS" },
  { name: "LLaMA", slug: "llama", cat: "Text", company: "Meta", website: "https://llama.meta.com", founded: 2023,
    tagline: "Meta's open-weight LLM family.",
    description: "Foundation models from Meta released with permissive open weights for self-hosting.",
    color: "oklch(0.72 0.18 270)", initials: "LL" },
  { name: "GitHub Copilot", slug: "github-copilot", cat: "Text", company: "GitHub × OpenAI", website: "https://github.com/features/copilot", founded: 2021,
    tagline: "Your AI pair programmer.",
    description: "Inline code completion and chat for VS Code, JetBrains and the GitHub UI.",
    color: "oklch(0.78 0.04 250)", initials: "CP" },
  { name: "Notion AI", slug: "notion-ai", cat: "Text", company: "Notion Labs", website: "https://notion.so/product/ai", founded: 2023,
    tagline: "AI inside your docs and wiki.",
    description: "Writing, summarising and Q&A built directly into Notion pages and databases.",
    color: "oklch(0.85 0.02 250)", initials: "NO" },
  { name: "Jasper", slug: "jasper", cat: "Text", company: "Jasper AI", website: "https://jasper.ai", founded: 2021,
    tagline: "Marketing copy, on-brand.",
    description: "Long-form marketing and brand-voice copy generator for teams.",
    color: "oklch(0.78 0.16 75)", initials: "JS" },
  { name: "Midjourney", slug: "midjourney", cat: "Image", company: "Midjourney, Inc.", website: "https://midjourney.com", founded: 2022,
    tagline: "Painterly, cinematic image generation.",
    description: "Independent research lab whose model is famous for stylised, art-directed imagery.",
    color: "oklch(0.74 0.16 320)", initials: "MJ" },
  { name: "Stable Diffusion", slug: "stable-diffusion", cat: "Image", company: "Stability AI", website: "https://stability.ai", founded: 2022,
    tagline: "Open-weight image diffusion.",
    description: "Open model family powering self-hosted image generation and a huge ecosystem of fine-tunes.",
    color: "oklch(0.74 0.18 290)", initials: "SD" },
  { name: "DALL·E", slug: "dalle", cat: "Image", company: "OpenAI", website: "https://openai.com/dall-e-3", founded: 2021,
    tagline: "Text-to-image from OpenAI.",
    description: "OpenAI's image model, integrated into ChatGPT for prompt-driven generation and editing.",
    color: "oklch(0.74 0.15 165)", initials: "DE" },
  { name: "Leonardo AI", slug: "leonardo-ai", cat: "Image", company: "Leonardo.Ai", website: "https://leonardo.ai", founded: 2022,
    tagline: "Game-asset and concept-art generator.",
    description: "Image platform with custom-trained models tuned for concept art, characters and game assets.",
    color: "oklch(0.74 0.16 30)", initials: "LE" },
  { name: "Ideogram", slug: "ideogram", cat: "Image", company: "Ideogram AI", website: "https://ideogram.ai", founded: 2023,
    tagline: "Image gen that nails text.",
    description: "Image model especially strong at typography, posters and logos.",
    color: "oklch(0.78 0.16 340)", initials: "ID" },
  { name: "Adobe Firefly", slug: "adobe-firefly", cat: "Image", company: "Adobe", website: "https://firefly.adobe.com", founded: 2023,
    tagline: "Commercially-safe creative AI.",
    description: "Adobe's image and effects model trained for commercial use, baked into Photoshop and Illustrator.",
    color: "oklch(0.74 0.18 25)", initials: "FF" },
  { name: "Runway", slug: "runway", cat: "Video", company: "Runway", website: "https://runwayml.com", founded: 2018,
    tagline: "Cinematic video generation and editing.",
    description: "Gen-series video models plus a full browser-based editing suite for filmmakers.",
    color: "oklch(0.78 0.04 250)", initials: "RW" },
  { name: "Sora", slug: "sora", cat: "Video", company: "OpenAI", website: "https://openai.com/sora", founded: 2024,
    tagline: "Text-to-video from OpenAI.",
    description: "OpenAI's video model producing high-fidelity scenes from text prompts.",
    color: "oklch(0.74 0.15 165)", initials: "SO" },
  { name: "Pika", slug: "pika", cat: "Video", company: "Pika Labs", website: "https://pika.art", founded: 2023,
    tagline: "Playful video generation.",
    description: "Easy text- and image-to-video model with strong stylisation controls.",
    color: "oklch(0.78 0.16 340)", initials: "PK" },
  { name: "HeyGen", slug: "heygen", cat: "Video", company: "HeyGen", website: "https://heygen.com", founded: 2020,
    tagline: "AI avatar video at scale.",
    description: "Studio for talking-avatar video — script in, lip-synced presenter out.",
    color: "oklch(0.74 0.18 25)", initials: "HG" },
  { name: "ElevenLabs", slug: "elevenlabs", cat: "Audio", company: "ElevenLabs", website: "https://elevenlabs.io", founded: 2022,
    tagline: "Lifelike voice synthesis.",
    description: "Voice cloning, multilingual TTS and dubbing with industry-leading naturalness.",
    color: "oklch(0.74 0.18 145)", initials: "EL" },
];

export const AI_TOOL_BY_NAME: Record<string, AITool> = Object.fromEntries(
  AI_TOOLS.map((t) => [t.name, t]),
);

export const AI_TOOL_BY_SLUG: Record<string, AITool> = Object.fromEntries(
  AI_TOOLS.map((t) => [t.slug, t]),
);

export const CAT_COLOR: Record<AICategory, string> = {
  Text: "oklch(0.72 0.22 295)",
  Image: "oklch(0.78 0.18 200)",
  Video: "oklch(0.70 0.20 30)",
  Audio: "oklch(0.74 0.20 145)",
};