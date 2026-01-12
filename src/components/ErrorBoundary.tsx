import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-geo-lightbg dark:bg-geo-darkbg p-8">
          <div className="text-center max-w-md">
            <ErrorOutlineIcon
              sx={{ fontSize: 80, color: "#e74c3c" }}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Please try
              reloading the page or go back to the home page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <summary className="cursor-pointer text-red-600 dark:text-red-400 font-medium">
                  Error Details
                </summary>
                <pre className="mt-2 text-sm text-red-800 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                variant="contained"
                onClick={this.handleReload}
                sx={{ borderRadius: "15px", fontFamily: "Poppins" }}
                className="!bg-geo-primary hover:!bg-geo-darkprimary"
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleGoHome}
                sx={{ borderRadius: "15px", fontFamily: "Poppins" }}
                className="!border-geo-primary !text-geo-primary hover:!bg-geo-primary/10"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
