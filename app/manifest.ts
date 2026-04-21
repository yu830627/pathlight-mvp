import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "引路 Pathlight",
    short_name: "引路",
    description: "以「未來視角」照亮當下的路，讓 AI 成為你最好的人生引導夥伴",
    start_url: "/",
    display: "standalone",
    background_color: "#1A2035",
    theme_color: "#1A2035",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
