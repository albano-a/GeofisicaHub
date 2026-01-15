import { useParams, Link } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Import all MDX posts - add new posts here
const posts: Record<
  string,
  { component: React.LazyExoticComponent<any>; meta: PostMeta }
> = {
  "first-post": {
    component: lazy(
      () => import("./posts/welcome-fundamentals-geophysics.mdx")
    ),
    meta: {
      title: "Welcome to the Fundamentals of Geophysics",
      description: "First post in this new section of GeofisicaHub",
      slug: "welcome-to-fundamentals",
      tags: ["geophysics", "seismic"],
    },
  },
};

export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  date?: string;
}

export const getAllPosts = (): PostMeta[] => {
  return Object.values(posts).map((p) => p.meta);
};

export default function FundamentalsPost() {
  const { slug } = useParams<{ slug: string }>();

  const post = slug ? posts[slug] : null;

  React.useEffect(() => {
    if (post) {
      document.title = `${post.meta.title} | Fundamentals | GeofisicaHub`;
    }
  }, [post]);

  if (!post) {
    return (
      <section className="py-16 bg-geo-50 dark:bg-geo-950 transition-colors min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-geo-darkbg dark:text-geo-lightbg mb-4">
            Post Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The post you're looking for doesn't exist.
          </p>
          <Link
            to="/fundamentals"
            className="inline-block bg-geo-primary dark:bg-geo-darkprimary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Fundamentals
          </Link>
        </div>
      </section>
    );
  }

  const PostContent = post.component;

  return (
    <section className="py-16 bg-geo-50 dark:bg-geo-950 transition-colors min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-8">
          <Link
            to="/fundamentals"
            className="text-geo-primary dark:text-geo-darkprimary hover:underline"
          >
            ← Back to Fundamentals
          </Link>
        </nav>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-geo-primary/10 dark:bg-geo-darkprimary/20 text-geo-primary dark:text-geo-darkprimary px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <PostContent />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
