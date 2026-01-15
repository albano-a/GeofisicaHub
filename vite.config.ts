import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All routes from AppRoutes.tsx
const routes = [
  "/",
  "/about",
  "/hub",
  "/tools",
  "/fundamentals",
  "/hub/geophysics",
  "/hub/geology",
  "/hub/physics",
  "/hub/calculus",
  "/hub/programming",
  "/posts",
  "/posts/welcome-to-geofisicahub",
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@mui/material",
            "@mui/icons-material",
          ],
          // UI libraries
          ui: ["react-icons"],
          // MDX and content rendering
          mdx: ["@mdx-js/react", "katex", "react-katex"],
          // Internationalization
          i18n: [
            "react-i18next",
            "i18next",
            "i18next-browser-languagedetector",
          ],
          // Large components
          components: [
            "./src/components/BookCard.tsx",
            "./src/components/ShareButtons.tsx",
            "./src/components/PostCard.tsx",
            "./src/components/PostMetaDisplay.tsx",
          ],
          // Pages
          pages: [
            "./src/pages/Home.tsx",
            "./src/pages/About.tsx",
            "./src/pages/MaterialHub.tsx",
            "./src/pages/Tools.tsx",
            "./src/pages/Posts.tsx",
            "./src/pages/EachPost.tsx",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
});
