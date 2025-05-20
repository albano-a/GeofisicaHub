import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Hub from "./pages/MaterialHub";
import Tools from "./pages/Tools";

// Import your page components here

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/hub" element={<Hub />} />
    <Route path="/tools" element={<Tools />} />
    {/* Add more routes as needed */}
    {/* <Route path="/your-path" element={<YourComponent />} /> */}
    {/* <Route path="*" element={<NotFound />} /> */}
  </Routes>
);

export default AppRoutes;
