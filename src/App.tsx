import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        {/* Main content */}
        <div>
          <AppRoutes></AppRoutes>
          <Analytics />
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
