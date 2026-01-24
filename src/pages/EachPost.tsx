import { useParams, Link } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";
import ShareButtons from "../components/ShareButtons";
import PostMetaDisplay from "../components/PostMetaDisplay";
import References from "../components/References";
import Breadcrumb from "../components/Breadcrumb";
import { useSEO } from "../hooks/useSEO";
export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  posted?: string;
  updated?: string;
  references?: string[];
  draft?: boolean;
  readingTime?: number; // minutes
}

// Static globs for each language (compiled modules)
const postModulesEn = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/en/*.mdx", { eager: true });
const postModulesPt = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/pt/*.mdx", { eager: true });
const postModulesEs = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/es/*.mdx", { eager: true });
const postModulesFr = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/fr/*.mdx", { eager: true });
const postModulesDe = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/de/*.mdx", { eager: true });
const postModulesIt = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("./posts/it/*.mdx", { eager: true });

// Raw text globs so we can compute reading time by counting words
const postModulesEnRaw = import.meta.glob("./posts/en/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;
const postModulesPtRaw = import.meta.glob("./posts/pt/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;
const postModulesEsRaw = import.meta.glob("./posts/es/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;
const postModulesFrRaw = import.meta.glob("./posts/fr/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;
const postModulesDeRaw = import.meta.glob("./posts/de/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;
const postModulesItRaw = import.meta.glob("./posts/it/*.mdx", {
  eager: true,
  as: "raw",
}) as Record<string, string>;

const languageModules: Record<
  string,
  Record<string, { frontmatter: PostMeta; default: React.ComponentType }>
> = {
  en: postModulesEn,
  pt: postModulesPt,
  es: postModulesEs,
  fr: postModulesFr,
  de: postModulesDe,
  it: postModulesIt,
};

// Cache for loaded posts by language
const postsCache: Record<
  string,
  Record<string, { component: React.LazyExoticComponent<any>; meta: PostMeta }>
> = {};

async function loadPostsForLanguage(
  lang: string,
): Promise<
  Record<string, { component: React.LazyExoticComponent<any>; meta: PostMeta }>
> {
  if (postsCache[lang]) {
    return postsCache[lang];
  }

  const posts: Record<
    string,
    { component: React.LazyExoticComponent<any>; meta: PostMeta }
  > = {};
  const modules = languageModules[lang];

  if (modules) {
    // Pick the raw source map for this language so we can compute reading time
    const rawMap: Record<string, string> | undefined = {
      en: postModulesEnRaw,
      pt: postModulesPtRaw,
      es: postModulesEsRaw,
      fr: postModulesFrRaw,
      de: postModulesDeRaw,
      it: postModulesItRaw,
    }[lang];

    Object.entries(modules).forEach(([path, moduleExports]) => {
      const meta = moduleExports.frontmatter as PostMeta;
      const Component = moduleExports.default;
      const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

      // Compute reading time from raw MDX text if available
      let readingTime: number | undefined = undefined;
      try {
        const raw = rawMap ? rawMap[path] : undefined;
        if (raw) {
          const words = raw
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
          const wordsPerMinute = 200; // average read speed
          readingTime = Math.max(1, Math.ceil(words / wordsPerMinute));
        }
      } catch (e) {
        console.log(`Error computing reading time: ${e}`);
      }

      posts[meta.slug] = {
        component: LazyComponent,
        meta: { ...meta, readingTime },
      };
    });
  }

  // If no posts for this language, try English as fallback
  if (Object.keys(posts).length === 0 && lang !== "en") {
    console.warn(
      `No posts found for language ${lang}, falling back to English`,
    );
    return loadPostsForLanguage("en");
  }

  postsCache[lang] = posts;
  return posts;
}

export const getAllPosts = async (lang: string = "en"): Promise<PostMeta[]> => {
  const posts = await loadPostsForLanguage(lang);
  return Object.values(posts)
    .map((p) => p.meta)
    .filter((post) => !post.draft); // Filter out draft posts
};

export default function FundamentalsPost() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const [post, setPost] = React.useState<{
    component: React.LazyExoticComponent<any>;
    meta: PostMeta;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      const posts = await loadPostsForLanguage(i18n.language);
      setPost(posts[slug] || null);
      setLoading(false);
    };
    loadPost();
  }, [slug, i18n.language]);

  // SEO hook for dynamic meta tags
  useSEO(
    post
      ? {
          title: post.meta.title,
          description: post.meta.description,
          keywords: post.meta.tags,
          url: `/posts/${post.meta.slug}`,
          type: "article",
          publishedTime: post.meta.posted,
          modifiedTime: post.meta.updated || post.meta.posted,
          author: "GeofisicaHub",
          section: "Geophysics Fundamentals",
          tags: post.meta.tags,
          locale: i18n.language,
        }
      : {},
  );

  if (loading) {
    return (
      <section className="py-16 bg-geo-lightbg dark:bg-geo-darkbg transition-colors min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!post || post.meta.draft) {
    return (
      <section className="py-16 bg-geo-lightbg dark:bg-geo-darkbg transition-colors min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            The post you're looking for doesn't exist or is a draft.
          </p>
          <Link
            to="/posts"
            className="inline-block bg-geo-primary dark:bg-geo-darkprimary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Posts
          </Link>
        </div>
      </section>
    );
  }

  const PostContent = post.component;

  return (
    <section className="py-16 bg-geo-lightbg dark:bg-geo-darkbg transition-colors min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb postTitle={post.meta.title} />

        <article className="prose prose-lg dark:prose-invert max-w-none text-justify">
          <Suspense fallback={<LoadingSpinner />}>
            <PostMetaDisplay meta={post.meta} />
            <ShareButtons title={post.meta.title} url={window.location.href} />
            <PostContent />
            <References references={post.meta.references || []} />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
