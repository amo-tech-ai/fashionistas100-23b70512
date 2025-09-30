import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useInRouterContext } from "react-router-dom";

/**
 * Temporary debugging component to verify all providers are mounted correctly
 * Remove this once you confirm everything works
 */
export function SanityProbe() {
  const qc = useQueryClient();
  const inRouter = useInRouterContext();
  const { isLoaded } = useUser();
  
  return (
    <div 
      data-probe 
      className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded font-mono z-50"
    >
      qc:{qc ? "✓" : "✗"} router:{inRouter ? "✓" : "✗"} clerk:{isLoaded ? "✓" : "⏳"}
    </div>
  );
}
