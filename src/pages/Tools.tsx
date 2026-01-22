import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomBackdrop from "../components/ToolsCard";
import React from "react";
import type { TFunction } from "i18next";
import { useSEO } from "../hooks/useSEO";
import Breadcrumb from "../components/Breadcrumb";

const getTools = (t: TFunction) => [
  {
    title: t("Tools.GeofisicaApp.Title"),
    description: t("Tools.GeofisicaApp.Desc"),
    image: "/tools/geofisicafirst.png",
    link: "https://geofisica.streamlit.app/",
  },
  {
    title: t("Tools.Symbolab.Title"),
    description: t("Tools.Symbolab.Desc"),
    image: "/tools/symbolab_ex.png",
    link: "https://symbolab.com/",
  },
  {
    title: t("Tools.Wolfram.Title"),
    description: t("Tools.Wolfram.Desc"),
    image: "/tools/wolfram_ex.png",
    link: "https://www.wolframalpha.com/",
  },
];

export default function Tools() {
  const { t, i18n } = useTranslation();
  const tools = getTools(t);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSEO({
    title: t("Tools.Title"),
    description:
      "Explore useful tools for geophysics, geology, physics, calculus, and programming.",
    keywords: ["tools", "geophysics", "calculators", "resources"],
    url: "/tools",
    type: "website",
    locale: i18n.language,
  });

  React.useEffect(() => {
    document.title = t("Tools.Title") + " | GeofisicaHub";
  }, [t]);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-5">
          <div className="w-full flex justify-start">
            <Breadcrumb />
          </div>
          <h1 className="text-4xl md:text-5xl text-center font-bold m-7 bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            {t("Tools.Title")} {/* Tools */}
          </h1>
          <h2 className="text-gray-900 dark:text-white text-xl md:text-2xl text-center font-semibold m-5">
            {t("Tools.Subtitle")}{" "}
            {/* Explore the collection of Geophysics tools below */}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <div
                key={i}
                onClick={() => setOpenIndex(i)}
                className="cursor-pointer p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md hover:shadow-geo-primary transition-shadow duration-300"
              >
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.title}
                  </h3>
                  <p className="text-gray-700 text-justify dark:text-gray-300 mt-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {tools.map((tool, i) => (
        <CustomBackdrop
          key={i}
          open={openIndex === i}
          onClose={() => setOpenIndex(null)}
          title={tool.title}
          description={tool.description}
          image={tool.image}
          buttonLink={tool.link}
        />
      ))}
    </>
  );
}
