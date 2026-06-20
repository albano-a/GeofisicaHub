import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { useSEO } from "../hooks/useSEO";

export default function NotFound() {
  const { i18n } = useTranslation();

  useSEO({
    title: "Page Not Found | GeofisicaHub",
    description: "The page you are looking for does not exist or may have moved.",
    url: "/404",
    type: "website",
    locale: i18n.language,
    noindex: true,
  });

  return (
    <main className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg flex items-center justify-center px-6 py-16">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-geo-primary dark:text-geo-darkprimary">
          404
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#2e333d] dark:text-white">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          This page does not exist, or it may have moved during a site update.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            component={Link}
            to="/"
            variant="contained"
            className="!bg-geo-primary hover:!bg-geo-darkprimary"
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Go Home
          </Button>
          <Button
            component={Link}
            to="/posts"
            variant="outlined"
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Browse Posts
          </Button>
        </div>
      </section>
    </main>
  );
}
