import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div>
      <Navbar />
      {/* Main content */}
      <div>
        <AppRoutes></AppRoutes>
        <Analytics />
      </div>
      <Footer />
    </div>
  );
}

export default App;
