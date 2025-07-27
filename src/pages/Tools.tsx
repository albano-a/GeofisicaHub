import { useTranslation } from "react-i18next";
import { useState } from "react";
import CustomBackdrop from "../components/ToolsCard";

const getTools = (t: any) => [
  {
    title: t("Tools.GeofisicaApp.Title"),
    description: t("Tools.GeofisicaApp.Desc"),
    image: "/images/geofisicafirst.png",
    link: "https://geofisica.streamlit.app/",
  },
  {
    title: "Log Interpreter",
    description: "Interpret well log data with precision.",
    image: "https://placehold.co/600x300?text=Logs",
    link: "https://example.com/logs",
  },
  {
    title: "Map Generator",
    description: "Generate geological maps on demand.",
    image: "https://placehold.co/600x300?text=Maps",
    link: "https://example.com/maps",
  },
  {
    title: "GravMag Tool",
    description: "Work with gravity and magnetic data efficiently.",
    image: "https://placehold.co/600x300?text=GravMag",
    link: "https://example.com/gravmag",
  },
  {
    title: "Petro Calculator",
    description: "Calculate porosity, saturation and more.",
    image: "https://placehold.co/600x300?text=Petro",
    link: "https://example.com/petro",
  },
  {
    title: "Velocity Modeler",
    description: "Build and adjust velocity models for subsurface.",
    image: "https://placehold.co/600x300?text=Velocity",
    link: "https://example.com/velocity",
  },
];

export default function Tools() {
  const { t } = useTranslation();
  const tools = getTools(t);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-5">
          <h1 className="text-4xl md:text-5xl text-center font-bold m-7 bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
            Tools
          </h1>
          <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl text-center font-semibold m-5">
            Explore the collection of Geophysics tools below
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <button
                key={i}
                onClick={() => setOpenIndex(i)}
                className="px-4 py-2 bg-geo-primary text-white font-semibold rounded-lg shadow-md hover:bg-geo-secondary focus:outline-none focus:ring-2 focus:ring-geo-accent focus:ring-opacity-75"
              >
                {tool.title}
              </button>
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
