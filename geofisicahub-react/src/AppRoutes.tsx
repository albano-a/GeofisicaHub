import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Import your page components here

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
);

export default AppRoutes;
