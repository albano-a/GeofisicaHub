import { useParams, Link } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";
import ShareButtons from "../components/ShareButtons";
import PostMetaDisplay from "../components/PostMetaDisplay";

export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  posted?: string;
  updated?: string;
}

// Static globs for each language
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
  lang: string
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
    Object.entries(modules).forEach(([_, moduleExports]) => {
      const meta = moduleExports.frontmatter as PostMeta;
      const Component = moduleExports.default;
      const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
      posts[meta.slug] = { component: LazyComponent, meta };
    });
  }

  // If no posts for this language, try English as fallback
  if (Object.keys(posts).length === 0 && lang !== "en") {
    console.warn(
      `No posts found for language ${lang}, falling back to English`
    );
    return loadPostsForLanguage("en");
  }

  postsCache[lang] = posts;
  return posts;
}

export const getAllPosts = async (lang: string = "en"): Promise<PostMeta[]> => {
  const posts = await loadPostsForLanguage(lang);
  return Object.values(posts).map((p) => p.meta);
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

  React.useEffect(() => {
    if (post) {
      document.title = `${post.meta.title} | Posts | GeofisicaHub`;
    }
  }, [post]);

  if (loading) {
    return (
      <section className="py-16 bg-geo-lightbg dark:bg-geo-darkbg transition-colors min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-16 bg-geo-lightbg dark:bg-geo-darkbg transition-colors min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            The post you're looking for doesn't exist.
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
        <nav className="mb-8">
          <Link
            to="/posts"
            className="text-geo-primary dark:text-geo-darkprimary hover:underline"
          >
            ← Back to Posts
          </Link>
        </nav>

        <article className="prose prose-lg dark:prose-invert max-w-none text-justify">
          <Suspense fallback={<LoadingSpinner />}>
            <PostMetaDisplay meta={post.meta} />
            <ShareButtons title={post.meta.title} url={window.location.href} />
            <PostContent />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
