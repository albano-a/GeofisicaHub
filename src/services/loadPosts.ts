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

const postModulesEn = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/en/*.mdx", { eager: true });
const postModulesPt = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/pt/*.mdx", { eager: true });
const postModulesEs = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/es/*.mdx", { eager: true });
const postModulesFr = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/fr/*.mdx", { eager: true });
const postModulesDe = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/de/*.mdx", { eager: true });
const postModulesIt = import.meta.glob<{
  frontmatter: PostMeta;
  default: React.ComponentType;
}>("../pages/posts/it/*.mdx", { eager: true });

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

const postsCache: Record<
  string,
  Record<string, { component: React.LazyExoticComponent<any>; meta: PostMeta }>
> = {};

export async function loadPostsForLanguage(
  lang: string,
): Promise<
  Record<string, { component: React.LazyExoticComponent<any>; meta: PostMeta }>
> {
  if (postsCache[lang]) return postsCache[lang];

  const posts: Record<
    string,
    { component: React.LazyExoticComponent<any>; meta: PostMeta }
  > = {};
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

  for (const [_, modExp] of Object.entries(mods)) {
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
