import * as Sentry from "@sentry/react";
import { ReactNode } from "react";

export function SafeSection({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<div className="p-4 text-center text-muted-foreground">Section failed to load.</div>}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
