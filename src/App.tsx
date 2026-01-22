import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div>
          <Navbar />
          {/* Main content */}
          <div>
            <AppRoutes></AppRoutes>
            <Analytics />
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
