import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubjectsCard from "../components/SubjectsCard";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

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

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-10">
          <Box sx={{ flexGrow: 1, py: 6, px: { xs: 2, sm: 6 } }}>
            <h1 className="text-4xl md:text-5xl text-center font-bold text-geo-primary dark:text-geo-darkprimary m-10">
              HUB
            </h1>
            <Grid container spacing={4} justifyContent="center">
              {materials.map((mat) => (
                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={mat.name}>
                  <SubjectsCard
                    subject={mat.name}
                    description={mat.desc}
                    link={mat.path}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </section>
        <Divider />
        <section className="w-full max-w-7xl mx-auto px-6 py-16 flex flex-col items-center space-y-10 text-geo-primary dark:text-geo-darkprimary">
          <h3 className="text-4xl font-bold tracking-tight text-center">
            Welcome to the HUB
          </h3>
          <p className="text-lg text-gray-900 dark:text-white text-center max-w-2xl">
            Each section is packed with{" "}
            <span className="text-geo-accent dark:text-geo-darkaccent font-semibold">
              materials and educational resources
            </span>{" "}
            designed to inspire and guide your journey as a geophysicist.
          </p>
          <div className="w-full max-w-7xl">
            <h5 className="text-2xl font-semibold my-5 text-geo-accent dark:text-geo-darkaccent text-center">
              Geophysics
            </h5>
            <p className="mt-2 text-gray-900 dark:text-white text-center">
              Calculus is like that final boss showing up early just to remind
              you life isn't going to be easy. It's the tough as nails subject
              in STEM courses that even the smartest students question their
              life choices over. But don't worry, it's not hopeless. Two authors
              I recommend for Calculus 1 and beyond: Hamilton Guidorizzi, who
              wrote four very thorough books but spread the content around like
              he wanted to make it harder. Then there's James Stewart, who
              packed almost everything into two volumes, making it more
              straightforward. Both have solid exercises and answer keys so you
              can check if you messed up. Pre Calculus recommendations are at
              the bottom. In the end, pick whichever one makes you question your
              sanity the least.
            </p>
            <h5 className="text-2xl font-semibold my-5 text-geo-accent dark:text-geo-darkaccent text-center">
              Geology
            </h5>
            <p className="mt-2 text-gray-900 dark:text-white text-center italic">
              Explore seismic, gravity, magnetic, and resistivity resources.
            </p>
            <h5 className="text-2xl font-semibold my-5 text-geo-accent dark:text-geo-darkaccent text-center">
              Programming
            </h5>
            <p className="mt-2 text-gray-900 dark:text-white text-center italic">
              Explore seismic, gravity, magnetic, and resistivity resources.
            </p>
            <h5 className="text-2xl font-semibold my-5 text-geo-accent dark:text-geo-darkaccent text-center">
              Calculus
            </h5>
            <p className="mt-2 text-gray-900 dark:text-white text-center italic">
              Explore seismic, gravity, magnetic, and resistivity resources.
            </p>
            <h5 className="text-2xl font-semibold my-5 text-geo-accent dark:text-geo-darkaccent text-center">
              Physics
            </h5>
            <p className="mt-2 text-gray-900 dark:text-white text-center italic">
              Explore seismic, gravity, magnetic, and resistivity resources.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
