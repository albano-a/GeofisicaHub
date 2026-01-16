import { useEffect } from "react";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  noindex?: boolean;
}

const DEFAULT_CONFIG: SEOConfig = {
  title: "GeofisicaHub | Geophysics & Geoscience Learning Hub",
  description:
    "GeofisicaHub: curated free resources and tools for geophysics, geology, physics, calculus and programming students and professionals.",
  keywords: [
    "geophysics",
    "geoscience",
    "geology",
    "physics",
    "calculus",
    "programming",
    "educational resources",
  ],
  image: "https://geofisicahub.com/plataforma-petroleo.jpg",
  url: "https://geofisicahub.com/",
  type: "website",
  author: "GeofisicaHub",
  locale: "en",
};

function getOrCreateMetaTag(
  property: string,
  isName: boolean = false
): HTMLMetaElement {
  const selector = isName
    ? `meta[name="${property}"]`
    : `meta[property="${property}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement;

  if (!element) {
    element = document.createElement("meta");
    if (isName) {
      element.setAttribute("name", property);
    } else {
      element.setAttribute("property", property);
    }
    document.head.appendChild(element);
  }

  return element;
}

function getOrCreateLinkTag(rel: string, hreflang?: string): HTMLLinkElement {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let element = document.querySelector(selector) as HTMLLinkElement;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) {
      element.setAttribute("hreflang", hreflang);
    }
    document.head.appendChild(element);
  }

  return element;
}

function updateOrCreateJsonLd(id: string, data: object): void {
  let script = document.querySelector(`script#${id}`) as HTMLScriptElement;

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export function useSEO(config: SEOConfig = {}) {
  useEffect(() => {
    const merged = { ...DEFAULT_CONFIG, ...config };
    const fullTitle = merged.title?.includes("GeofisicaHub")
      ? merged.title
      : `${merged.title} | GeofisicaHub`;
    const canonicalUrl = merged.url?.startsWith("http")
      ? merged.url
      : `https://geofisicahub.com${merged.url}`;

    // Update document title
    document.title = fullTitle;

    // Update basic meta tags
    getOrCreateMetaTag("description", true).content = merged.description || "";
    getOrCreateMetaTag("keywords", true).content =
      merged.keywords?.join(", ") || "";
    getOrCreateMetaTag("author", true).content = merged.author || "";
    getOrCreateMetaTag("robots", true).content = merged.noindex
      ? "noindex, nofollow"
      : "index, follow, max-snippet:-1, max-image-preview:large";

    // Update canonical link
    getOrCreateLinkTag("canonical").href = canonicalUrl;

    // Update Open Graph tags
    getOrCreateMetaTag("og:type").content = merged.type || "website";
    getOrCreateMetaTag("og:title").content = fullTitle;
    getOrCreateMetaTag("og:description").content = merged.description || "";
    getOrCreateMetaTag("og:url").content = canonicalUrl;
    getOrCreateMetaTag("og:image").content = merged.image || "";
    getOrCreateMetaTag("og:image:alt").content = merged.title || "";
    getOrCreateMetaTag("og:site_name").content = "GeofisicaHub";
    getOrCreateMetaTag("og:locale").content = getOgLocale(
      merged.locale || "en"
    );

    // Update Twitter tags
    getOrCreateMetaTag("twitter:card", true).content = "summary_large_image";
    getOrCreateMetaTag("twitter:title", true).content = fullTitle;
    getOrCreateMetaTag("twitter:description", true).content =
      merged.description || "";
    getOrCreateMetaTag("twitter:image", true).content = merged.image || "";
    getOrCreateMetaTag("twitter:image:alt", true).content = merged.title || "";

    // Article specific meta tags
    if (merged.type === "article") {
      if (merged.publishedTime) {
        getOrCreateMetaTag("article:published_time").content =
          merged.publishedTime;
      }
      if (merged.modifiedTime) {
        getOrCreateMetaTag("article:modified_time").content =
          merged.modifiedTime;
      }
      if (merged.author) {
        getOrCreateMetaTag("article:author").content = merged.author;
      }
      if (merged.section) {
        getOrCreateMetaTag("article:section").content = merged.section;
      }

      // Update Article structured data
      updateOrCreateJsonLd("article-schema", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: merged.title,
        description: merged.description,
        image: merged.image,
        datePublished: merged.publishedTime,
        dateModified: merged.modifiedTime || merged.publishedTime,
        author: {
          "@type": "Person",
          name: merged.author,
        },
        publisher: {
          "@type": "Organization",
          name: "GeofisicaHub",
          logo: {
            "@type": "ImageObject",
            url: "https://geofisicahub.com/plataforma-petroleo.jpg",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        keywords: merged.tags?.join(", "),
        articleSection: merged.section || "Geophysics",
      });
    }

    // Cleanup function to remove article-specific tags when navigating away
    return () => {
      if (merged.type === "article") {
        const articleSchema = document.querySelector("#article-schema");
        if (articleSchema) {
          articleSchema.remove();
        }
      }
    };
  }, [config]);
}

function getOgLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    en: "en_US",
    pt: "pt_BR",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
    it: "it_IT",
  };
  return localeMap[locale] || "en_US";
}

// Breadcrumb structured data generator
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `https://geofisicahub.com${item.url}`,
    })),
  };
}

export function useBreadcrumbSchema(items: { name: string; url: string }[]) {
  useEffect(() => {
    if (items.length > 0) {
      updateOrCreateJsonLd(
        "breadcrumb-schema",
        generateBreadcrumbSchema(items)
      );
    }

    return () => {
      const breadcrumbSchema = document.querySelector("#breadcrumb-schema");
      if (breadcrumbSchema) {
        breadcrumbSchema.remove();
      }
    };
  }, [items]);
}
