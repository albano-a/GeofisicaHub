import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

// All routes from AppRoutes.tsx
const routes = [
  "/",
  "/about",
  "/hub",
  "/tools",
  "/hub/geophysics",
  "/hub/geology",
  "/hub/physics",
  "/hub/calculus",
  "/hub/programming",
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: "https://geofisicahub.com",
      dynamicRoutes: routes,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
      generateRobotsTxt: true,
      robots: [
        { userAgent: "*", allow: "/" },
        { userAgent: "*", disallow: ["/admin/", "/api/"] },
      ],
    }),
  ],
});
