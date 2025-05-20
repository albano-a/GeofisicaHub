import React from "react";
import { useTranslation } from "react-i18next";
import BiotechTwoToneIcon from "@mui/icons-material/BiotechTwoTone";
import CalculateTwoToneIcon from "@mui/icons-material/CalculateTwoTone";
import LibraryBooksTwoToneIcon from "@mui/icons-material/LibraryBooksTwoTone";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const features = [
  {
    title: "StudyMaterials",
    description: "StudyMaterialsdesc",
    icon: (
      <span className="text-geo-primary dark:text-geo-darkprimary">
        <LibraryBooksTwoToneIcon fontSize="large" color="inherit" />
      </span>
    ),
    link: "/hub",
  },
  {
    title: "CalculatorsResources",
    description: "CalculatorsResourcesdesc",
    icon: (
      <span className="text-geo-primary dark:text-geo-darkprimary">
        <CalculateTwoToneIcon fontSize="large" color="inherit" />
      </span>
    ),
    link: "/tools",
  },
  {
    title: "ScientificPubli",
    description: "ScientificPublidesc",
    icon: (
      <span className="text-geo-primary dark:text-geo-darkprimary">
        <BiotechTwoToneIcon fontSize="large" color="inherit" />
      </span>
    ),
    link: "/research",
  },
];

const FeatureSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-geo-50 dark:bg-geo-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-geo-darkbg dark:text-geo-lightbg mb-8 text-center">
          {t("Features.PowerfulFeatures")}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-geo-lightbg dark:bg-geo-darkbg rounded-xl shadow-md shadow-geo-primary dark:shadow-geo-darkprimary p-8 flex flex-col items-center transition transform hover:-translate-y-2 hover:shadow-xl hover:shadow-geo-primary hover:dark:shadow-geo-darkprimary border-2 border-geo-primary dark:border-geo-darkprimary dark:text-geo-lightbg h-full"
              style={{ minHeight: 370, display: "flex" }}
            >
              <div className="mb-4 text-geo-darkprimary">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-geo-darkbg dark:text-geo-lightbg mb-2 text-center">
                {t(`Features.${feature.title}`)}
              </h3>
              <p className="text-geo-600 dark:text-geo-lightbg text-center mb-4 min-h-[56px] flex items-center justify-center">
                {t(`Features.${feature.description}`)}
              </p>
              <Button
                component={Link}
                to={feature.link}
                variant="contained"
                color="inherit"
                fullWidth
                sx={{
                  mt: "auto",
                  borderRadius: "10px",
                  fontWeight: 600,
                  boxShadow: "none",
                  textTransform: "none",
                }}
                className="!bg-geo-primary hover:!bg-geo-darkprimary !text-geo-lightbg dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
              >
                {t("HomePage.GetStarted")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
