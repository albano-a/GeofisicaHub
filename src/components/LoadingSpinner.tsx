import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-geo-lightbg dark:bg-geo-darkbg">
      <div className="text-center">
        <CircularProgress size={60} thickness={4} sx={{ color: "#1077bc" }} />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
