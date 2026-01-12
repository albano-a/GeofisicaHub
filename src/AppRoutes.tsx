import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Hub = lazy(() => import("./pages/MaterialHub"));
const Tools = lazy(() => import("./pages/Tools"));
const Calculus = lazy(() => import("./pages/hub/Calculus"));
const Geology = lazy(() => import("./pages/hub/Geology"));
const Geophysics = lazy(() => import("./pages/hub/Geophysics"));
const Physics = lazy(() => import("./pages/hub/Physics"));
const Programming = lazy(() => import("./pages/hub/Programming"));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/hub/calculus" element={<Calculus />} />
      <Route path="/hub/geology" element={<Geology />} />
      <Route path="/hub/geophysics" element={<Geophysics />} />
      <Route path="/hub/physics" element={<Physics />} />
      <Route path="/hub/programming" element={<Programming />} />
      {/* Add more routes as needed */}

      <Route path="*" element={<Home />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
