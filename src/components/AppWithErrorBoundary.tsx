import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import App from "../App";

function ErrorFallback({ error }: { error: unknown }) {
  // Surface the real error once, without crashing the fallback UI
  useEffect(() => {
    try {
      // Keep it concise in prod; detailed in dev
      if (import.meta.env.MODE === "development") {
        // eslint-disable-next-line no-console
        console.error("Sentry fallback captured error:", error);
      } else {
        // Minimal logging in production to avoid leaking details
        // eslint-disable-next-line no-console
        console.error("An error occurred. See Sentry for details.");
      }
    } catch {
      /* no-op */
    }
  }, [error]);

  const handleRefresh = () => {
    // Safe refresh only when running in browser contexts
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">Oops! Something went wrong</h1>
      <p className="mt-2 opacity-80">
        We've been notified and are working on a fix.
      </p>
      <button
        type="button"
        onClick={handleRefresh}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh Page
      </button>
    </div>
  );
}

export const AppWithErrorBoundary = Sentry.withErrorBoundary(App, {
  // Use a component, not raw JSX fragments with inline handlers
  fallback: ({ error }) => <ErrorFallback error={error} />,
  // Show Sentry's dialog only in dev to avoid exposing details to end users
  showDialog: import.meta.env.MODE === "development",
});
