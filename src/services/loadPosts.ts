import { lazy } from "react";

export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  posted?: string;
  updated?: string;
  references?: string[];
  draft?: boolean;
}

type PostComponent = React.ComponentType<Record<string, never>>;

interface PostModule {
  frontmatter: PostMeta;
  default: PostComponent;
}

export interface LoadedPost {
  component: React.LazyExoticComponent<PostComponent>;
  meta: PostMeta;
}

const postModulesEn = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/en/*.mdx", { eager: true });
const postModulesPt = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/pt/*.mdx", { eager: true });
const postModulesEs = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/es/*.mdx", { eager: true });
const postModulesFr = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/fr/*.mdx", { eager: true });
const postModulesDe = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/de/*.mdx", { eager: true });
const postModulesIt = import.meta.glob<{
  frontmatter: PostMeta;
  default: PostComponent;
}>("../pages/posts/it/*.mdx", { eager: true });

const languageModules: Record<string, Record<string, PostModule>> = {
  en: postModulesEn,
  pt: postModulesPt,
  es: postModulesEs,
  fr: postModulesFr,
  de: postModulesDe,
  it: postModulesIt,
};

const postsCache: Record<string, Record<string, LoadedPost>> = {};

export async function loadPostsForLanguage(
  lang: string,
): Promise<Record<string, LoadedPost>> {
  if (postsCache[lang]) return postsCache[lang];

  const posts: Record<string, LoadedPost> = {};
  const mods = languageModules[lang];

  if (!mods) {
    if (lang !== "en") {
      console.warn(
        `No posts found for language ${lang}, falling back to English`,
      );
      return loadPostsForLanguage("en");
    }
    postsCache[lang] = posts;
    return posts;
  }

  for (const [, modExp] of Object.entries(mods)) {
    const meta = modExp.frontmatter as PostMeta;
    const lzComp = lazy(() => Promise.resolve({ default: modExp.default }));

    posts[meta.slug] = {
      component: lzComp,
      meta: { ...meta },
    };
  }

  postsCache[lang] = posts;
  return posts;
}

export async function getAllPosts(lang: string = "en"): Promise<PostMeta[]> {
  const posts = await loadPostsForLanguage(lang);
  return Object.values(posts)
    .map((p) => p.meta)
    .filter((post) => !post.draft); // Filter out draft posts
}
