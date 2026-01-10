import { useTranslation } from "react-i18next";
import SubjectsCard from "../components/SubjectsCard";
import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const materials = [
  {
    name: "Geophysics",
    path: "/hub/geophysics",
    desc: "Discover Geophysics.",
  },
  {
    name: "Geology",
    path: "/hub/geology",
    desc: "Explore Geology.",
  },
  {
    name: "Programming",
    path: "/hub/programming",
    desc: "Learn Programming.",
  },
  {
    name: "Calculus",
    path: "/hub/calculus",
    desc: "Defeat Calculus.",
  },
  {
    name: "Physics",
    path: "/hub/physics",
    desc: "Understand Physics.",
  },
];

export default function MaterialHub() {
  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = "HUB | GeofisicaHub";
  }, [t]);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-5">
          <Box sx={{ flexGrow: 1, py: 6, px: { xs: 2, sm: 6 } }}>
            <h1 className="text-4xl md:text-5xl text-center font-bold m-7 bg-gradient-to-r from-geo-accent via-geo-primary to-geo-secondary bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
              HUB
            </h1>
            <div className="m-3">
              <p className="text-lg text-gray-900 dark:text-white text-center">
                {t("HUB.Desc1")}{" "}
                <span className="text-geo-accent underline dark:text-geo-darkaccent font-semibold">
                  {t("HUB.Desc2")}
                </span>{" "}
                {t("HUB.Desc3")}
              </p>
            </div>

            <Grid container spacing={4} justifyContent="center">
              {materials.map((mat) => (
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={mat.name}>
                  <SubjectsCard
                    subject={t(`HUB.${mat.name}`)}
                    description={mat.desc}
                    link={mat.path}
                  />
                </Grid>
              ))}
            </Grid>
            <div
              className="bg-amber-100 dark:bg-amber-900 border-l-4 border-amber-500 dark:border-amber-300 text-amber-700 dark:text-amber-200 p-4 mt-6 rounded"
              role="alert"
            >
              <p className="text-md md:text-lg text-justify">
                {t("HUB.Warning")}
              </p>
            </div>
          </Box>
        </section>
      </div>
    </>
  );
}
