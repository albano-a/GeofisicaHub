import { useTranslation } from "react-i18next";
import OilBarrelTwoToneIcon from "@mui/icons-material/OilBarrelTwoTone";
import DiamondTwoToneIcon from "@mui/icons-material/DiamondTwoTone";
import EngineeringTwoToneIcon from "@mui/icons-material/EngineeringTwoTone";
import ForestTwoToneIcon from "@mui/icons-material/ForestTwoTone";
import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import { useSEO } from "../hooks/useSEO";

export default function About() {
  const { t, i18n } = useTranslation();

  useSEO({
    title: t("About.Title"),
    description: t("About.Section1"),
    url: "/about",
    locale: i18n.language,
  });

  // Set document title
  React.useEffect(() => {
    document.title = t("About.Title") + " | GeofisicaHub";
  }, [t]);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        <section className="w-full mx-auto p-10 flex flex-col items-center space-y-10">
          <div className="w-full max-w-3xl flex justify-start">
            <Breadcrumb />
          </div>
          <div className="flex flex-col items-center justify-center ">
            <h1 className="text-4xl md:text-5xl text-center font-bold text-geo-primary dark:text-geo-darkprimary mt-10">
              {t("About.Title")}
            </h1>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl">
              {t("About.Section1")}
            </p>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl">
              {t("About.Section2")}
            </p>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl">
              {t("About.Section3")}{" "}
              <a
                href="https://github.com/albano-a/GeofisicaHub"
                className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
            <h1 className="text-4xl md:text-5xl text-center font-bold text-geo-primary dark:text-geo-darkprimary mt-10">
              {t("WhatGeophysics.Title")}
            </h1>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl ">
              {t("WhatGeophysics.Section1")}
            </p>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl ">
              {t("WhatGeophysics.Section2")}
            </p>
            <h1 className="text-2xl md:text-3xl text-center font-bold text-geo-primary dark:text-geo-darkprimary mt-10">
              {t("Applications.Title")}
            </h1>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl ">
              {t("Applications.Section1")}
            </p>
            <dl className="mt-6 max-w-3xl w-full border dark:bg-geo-darkbg rounded-lg shadow-md p-6 space-y-4">
              <div>
                <dt className="font-bold text-lg text-geo-primary dark:text-geo-darkprimary">
                  <OilBarrelTwoToneIcon />{" "}
                  {t("Applications.Section2.BoxTitle1")}
                </dt>
                <dd className="text-[#2e333d] dark:text-white">
                  {t("Applications.Section2.BoxDesc1")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-lg text-geo-primary dark:text-geo-darkprimary">
                  <DiamondTwoToneIcon /> {t("Applications.Section2.BoxTitle2")}
                </dt>
                <dd className="text-[#2e333d] dark:text-white">
                  {t("Applications.Section2.BoxDesc2")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-lg text-geo-primary dark:text-geo-darkprimary">
                  <EngineeringTwoToneIcon />{" "}
                  {t("Applications.Section2.BoxTitle3")}
                </dt>
                <dd className="text-[#2e333d] dark:text-white">
                  {t("Applications.Section2.BoxDesc3")}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-lg text-geo-primary dark:text-geo-darkprimary">
                  <ForestTwoToneIcon /> {t("Applications.Section2.BoxTitle4")}
                </dt>
                <dd className="text-[#2e333d] dark:text-white">
                  {t("Applications.Section2.BoxDesc4")}
                </dd>
              </div>
            </dl>
            <h1 className="text-2xl md:text-3xl text-center font-bold text-geo-primary dark:text-geo-darkprimary mt-10">
              {t("JobMarket.Title")}
            </h1>
            <p className="text-justify text-xl text-[#2e333d] dark:text-white mt-5 max-w-3xl ">
              {t("JobMarket.Section1")}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
