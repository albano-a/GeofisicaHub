import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://geofisicahub.com";
const DIST_DIR = path.resolve("dist");
const POSTS_DIR = path.resolve("src/pages/posts");
const DEFAULT_IMAGE = `${SITE_URL}/plataforma-petroleo.jpg`;

const staticRoutes = [
  {
    path: "/",
    title: "GeofisicaHub | Geophysics & Geoscience Learning Hub",
    description:
      "GeofisicaHub: curated free resources and tools for geophysics, geology, physics, calculus and programming students and professionals.",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About | GeofisicaHub",
    description:
      "Learn more about GeofisicaHub and its mission to organize geoscience and geophysics learning resources.",
  },
  {
    path: "/hub",
    title: "Hub | GeofisicaHub",
    description:
      "Explore educational materials in geophysics, geology, physics, calculus, and programming.",
    priority: "0.9",
  },
  {
    path: "/tools",
    title: "Tools | GeofisicaHub",
    description:
      "Useful scientific, mathematical, and geoscience tools curated for students and professionals.",
  },
  {
    path: "/posts",
    title: "Posts | GeofisicaHub",
    description:
      "Articles about geophysics fundamentals, seismic methods, earth sciences, and educational resources.",
    priority: "0.9",
  },
  {
    path: "/hub/geophysics",
    title: "Geophysics | GeofisicaHub",
    description:
      "Geophysics books and learning materials curated for students and professionals.",
  },
  {
    path: "/hub/geology",
    title: "Geology | GeofisicaHub",
    description:
      "Geology resources, books, and references for earth science learning.",
  },
  {
    path: "/hub/physics",
    title: "Physics | GeofisicaHub",
    description:
      "Physics materials that support geophysics and earth science education.",
  },
  {
    path: "/hub/calculus",
    title: "Calculus | GeofisicaHub",
    description:
      "Calculus books and references for scientific and engineering foundations.",
  },
  {
    path: "/hub/programming",
    title: "Programming | GeofisicaHub",
    description:
      "Programming resources for geoscience, scientific computing, and data workflows.",
  },
  {
    path: "/login",
    title: "Admin Login | GeofisicaHub",
    description: "Administrative login for GeofisicaHub.",
    noindex: true,
  },
  {
    path: "/admin",
    title: "Admin | GeofisicaHub",
    description: "Administrative area for GeofisicaHub.",
    noindex: true,
  },
  {
    path: "/viewer",
    title: "PDF Viewer | GeofisicaHub",
    description: "GeofisicaHub PDF reader.",
    noindex: true,
  },
];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalizeRoute = (routePath) =>
  routePath === "/" ? "/" : `/${routePath.replace(/^\/|\/$/g, "")}`;

const canonicalFor = (routePath) =>
  routePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizeRoute(routePath)}`;

const toIsoDate = (value) => {
  if (!value) return undefined;
  const text = String(value);
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return text;
};

const pageFileFor = (routePath) =>
  routePath === "/"
    ? path.join(DIST_DIR, "index.html")
    : path.join(DIST_DIR, routePath.replace(/^\//, ""), "index.html");

const replaceOrAddMeta = (html, selector, tag) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+[^>]*${escapedSelector}[^>]*>`, "i");
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
};

const replaceOrAddLink = (html, rel, tag) => {
  const pattern = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*>`, "i");
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
};

const removeJsonLd = (html, id) =>
  html.replace(
    new RegExp(
      `\\s*<script type=["']application/ld\\+json["'] id=["']${id}["']>[\\s\\S]*?<\\/script>`,
      "i",
    ),
    "",
  );

const addJsonLd = (html, id, data) => {
  const clean = removeJsonLd(html, id);
  const json = JSON.stringify(data);
  return clean.replace(
    "</head>",
    `    <script type="application/ld+json" id="${id}">${json}</script>\n  </head>`,
  );
};

const applySeo = (baseHtml, page) => {
  const canonical = canonicalFor(page.path);
  const title = page.title.includes("GeofisicaHub")
    ? page.title
    : `${page.title} | GeofisicaHub`;
  const description = page.description;
  const image = page.image || DEFAULT_IMAGE;
  const robots = page.noindex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large";

  let html = baseHtml.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  );

  html = replaceOrAddMeta(
    html,
    'name="description"',
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'name="robots"',
    `<meta name="robots" content="${robots}" />`,
  );
  html = replaceOrAddLink(
    html,
    "canonical",
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'property="og:type"',
    `<meta property="og:type" content="${page.type || "website"}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'property="og:title"',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'property="og:description"',
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'property="og:url"',
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'property="og:image"',
    `<meta property="og:image" content="${image}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'name="twitter:title"',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'name="twitter:description"',
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrAddMeta(
    html,
    'name="twitter:image"',
    `<meta name="twitter:image" content="${image}" />`,
  );

  if (page.type === "article") {
    const publishedTime = toIsoDate(page.posted);
    const modifiedTime = toIsoDate(page.updated || page.posted);

    html = replaceOrAddMeta(
      html,
      'property="article:published_time"',
      `<meta property="article:published_time" content="${escapeHtml(publishedTime || "")}" />`,
    );
    html = addJsonLd(html, "article-schema", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description,
      image,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: { "@type": "Organization", name: "GeofisicaHub" },
      publisher: {
        "@type": "Organization",
        name: "GeofisicaHub",
        logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      keywords: page.tags?.join(", "),
    });
  }

  return html;
};

const writePage = async (baseHtml, page) => {
  const filePath = pageFileFor(page.path);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, applySeo(baseHtml, page));
};

const readPostRoutes = async () => {
  const routesBySlug = new Map();

  const languages = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  for (const language of languages.filter((entry) => entry.isDirectory())) {
    const languageDir = path.join(POSTS_DIR, language.name);
    const files = await fs.readdir(languageDir);

    for (const file of files.filter((name) => name.endsWith(".mdx"))) {
      const source = await fs.readFile(path.join(languageDir, file), "utf8");
      const { data } = matter(source);
      if (data.draft || !data.slug) continue;
      if (routesBySlug.has(data.slug)) continue;

      routesBySlug.set(data.slug, {
        path: `/posts/${data.slug}`,
        title: data.title || data.slug,
        description:
          data.description || "GeofisicaHub article about geoscience learning.",
        type: "article",
        posted: data.posted,
        updated: data.updated,
        tags: Array.isArray(data.tags) ? data.tags : [],
        priority: "0.8",
      });
    }
  }

  return [...routesBySlug.values()].sort((a, b) =>
    a.path.localeCompare(b.path),
  );
};

const writeSitemap = async (pages) => {
  const urls = pages
    .filter((page) => !page.noindex)
    .map(
      (page) => `  <url>
    <loc>${canonicalFor(page.path)}</loc>
    <changefreq>${page.type === "article" ? "monthly" : "weekly"}</changefreq>
    <priority>${page.priority || "0.8"}</priority>
  </url>`,
    )
    .join("\n");

  await fs.writeFile(
    path.join(DIST_DIR, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  );
};

const writeRobots = async () => {
  await fs.writeFile(
    path.join(DIST_DIR, "robots.txt"),
    `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /viewer/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
Host: geofisicahub.com
`,
  );
};

const main = async () => {
  const indexPath = path.join(DIST_DIR, "index.html");
  const baseHtml = await fs.readFile(indexPath, "utf8");
  const postRoutes = await readPostRoutes();
  const pages = [...staticRoutes, ...postRoutes];

  for (const page of pages) {
    await writePage(baseHtml, page);
  }

  await fs.writeFile(
    path.join(DIST_DIR, "404.html"),
    applySeo(baseHtml, {
      path: "/404",
      title: "Page Not Found | GeofisicaHub",
      description:
        "The page you are looking for does not exist or may have moved.",
      noindex: true,
    }),
  );
  await writeSitemap(pages);
  await writeRobots();

  console.log(
    `Generated ${pages.length} static route shells, sitemap.xml, robots.txt, and 404.html.`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
