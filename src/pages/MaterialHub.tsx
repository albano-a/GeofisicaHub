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
    desc: "Kill Calculus.",
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
        <section className="w-full max-w-7xl mx-auto p-10 flex flex-col items-center space-y-10">
          <h3>TODO: Explain each content</h3>
        </section>
      </div>
    </>
  );
}
