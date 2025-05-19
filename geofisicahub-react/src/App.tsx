import Navbar from "./components/Navbar";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <div>
      <Navbar />
      {/* Main content */}
      <div>
        <AppRoutes></AppRoutes>
      </div>
    </div>
  );
}

export default App;
