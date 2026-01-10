import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import FeatureSection from "../components/FeatureSection";
import Divider from "@mui/material/Divider";
import React from "react";
import AdUnit from "../components/AdUnit";

export default function Home() {
  const { t } = useTranslation();

  React.useEffect(() => {
    document.title = "GeofisicaHub";
  }, [t]);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        {/* Hero Section */}

        <section className="w-full max-w-5xl mx-auto p-10 flex flex-col items-center space-y-10">
          <figure className="w-96 h-96 flex items-center justify-center ">
            <img
              src="/gifs/earth.gif"
              alt="Earth"
              className="w-full h-full object-contain rounded-full "
            />
          </figure>
          <div className="w-full flex flex-col items-center space-y-5">
            <h1 className="text-4xl md:text-5xl text-center font-bold text-[#2e333d] dark:text-white">
              {t("HomePage.Welcome")}
            </h1>
            <p className="text-center text-xl text-[#2e333d] dark:text-white">
              {t("HomePage.Intro")}
            </p>
            <span className=" rounded-[15px] ">
              <Button
                variant="contained"
                sx={{
                  borderRadius: "15px", // Rounded corners
                  fontFamily: "Poppins",
                }}
                href="/hub"
                className="mt-4 font-sans !bg-geo-primary hover:!bg-geo-darkprimary dark:!bg-geo-primary dark:!text-geo-lightbg dark:hover:!bg-geo-darkprimary"
                size="large"
              >
                {t("HomePage.GetStarted")}!
              </Button>
            </span>
          </div>
        </section>
        <Divider />
        {/* Features Section */}
        <FeatureSection />
        {/* <AdUnit adSlot="1234567890" /> */}
        {/* Footer */}
      </div>
    </>
  );
}
