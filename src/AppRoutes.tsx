import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Hub from "./pages/MaterialHub";
import Tools from "./pages/Tools";
import Calculus from "./pages/hub/Calculus";
import Geology from "./pages/hub/Geology";
import Geophysics from "./pages/hub/Geophysics";
import Physics from "./pages/hub/Physics";
import Programming from "./pages/hub/Programming";


// Import your page components here

const AppRoutes: React.FC = () => (
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
);

export default AppRoutes;
