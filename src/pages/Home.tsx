import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FeatureSection from "../components/FeatureSection";
import Divider from "@mui/material/Divider";
import { Alert, LinearProgress, Box } from "@mui/material";

export default function Home() {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 10000;
    const TRANSITION_MS = 400;

    const update = () => {
      const elapsed = Date.now() - start;
      console.log(`Time elapsed: ${elapsed}`);
      const pct = Math.min((elapsed / duration) * 100, 100);
      console.log(`Percentage: ${pct}`);
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => setShowAlert(false), TRANSITION_MS);
      }
    };

    update();

    return () => {};
  }, []);

  return (
    <>
      <div className="min-h-screen pb-10 bg-geo-lightbg dark:bg-geo-darkbg">
        {/* Hero Section */}

        <section className="w-full max-w-5xl mx-auto p-10 flex flex-col items-center space-y-10">
          {showAlert && (
            <Box className="fixed w-full max-w-5xl">
              <Alert
                severity="info"
                sx={{ backgroundColor: "#bfdbfe", color: "#1e3a8a" }}
              >
                {t("HomePage.Alert")}
                {/* The website has a new look. Check it out! */}
              </Alert>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "4px",
                  borderRadius: "0 0 4px 4px",
                  backgroundColor: "#dbeafe",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#2563eb",
                    transition: "none",
                  },
                }}
              />
            </Box>
          )}
          <figure className="w-96 h-96 flex items-center justify-center ">
            <img
              src="/images/gifs/earth.gif"
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

        {/* Footer */}
      </div>
    </>
  );
}
