import { useTranslation } from "react-i18next";
import React from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "./FundamentalsPost";
import type { PostMeta } from "./FundamentalsPost";

export default function Fundamentals() {
  const { t } = useTranslation();
  const posts = getAllPosts();

  React.useEffect(() => {
    document.title = t("Fundamentals.Title") + " | GeofisicaHub";
  }, [t]);

  return (
    <>
      <section className="py-16 bg-geo-50 dark:bg-geo-950 transition-colors min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-geo-darkbg dark:text-geo-lightbg mb-4 text-center">
            {t("Fundamentals.Title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">
            {t("Fundamentals.Description")}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: PostMeta) => (
              <Link
                key={post.slug}
                to={`/fundamentals/${post.slug}`}
                className="block bg-white dark:bg-geo-900 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-geo-darkbg dark:text-geo-lightbg mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-geo-primary/10 dark:bg-geo-darkprimary/20 text-geo-primary dark:text-geo-darkprimary px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No posts available yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
