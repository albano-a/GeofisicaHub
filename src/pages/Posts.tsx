import { useTranslation } from "react-i18next";
import React from "react";
import { getAllPosts } from "./EachPost";
import type { PostMeta } from "./EachPost";
import PostCard from "../components/PostCard";

export default function Posts() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = React.useState<PostMeta[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const allPosts = await getAllPosts(i18n.language);
      setPosts(allPosts);
      setLoading(false);
    };
    loadPosts();
  }, [i18n.language]);

  React.useEffect(() => {
    document.title = t("Posts.Title") + " | GeofisicaHub";
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-geo-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-5">
          <h2 className="text-4xl md:text-5xl text-center font-bold m-7 bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            {t("Posts.Title")}
          </h2>
          <p className="text-gray-900 dark:text-white text-xl md:text-2xl text-center font-semibold m-5">
            {t("Posts.Description")}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No posts available yet. Check back soon!
            </p>
          )}
        </section>
      </div>
    </>
  );
}
