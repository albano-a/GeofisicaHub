import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <div>
      <Navbar />
      {/* Main content */}
      <div>
        <AppRoutes></AppRoutes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
