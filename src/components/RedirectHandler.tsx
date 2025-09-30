import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResolvedRole } from '@/hooks/useResolvedRole';
import deprecations from '../../deprecations.json';

/**
 * Handles deprecated route redirects (301)
 * Checks current path against deprecations.json and redirects if needed
 */
export function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useResolvedRole();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if current path is deprecated
    const deprecatedPaths = deprecations.deprecations as Record<string, string>;
    let redirectPath = deprecatedPaths[currentPath];

    if (redirectPath) {
      // Replace {role} placeholder with actual user role
      if (redirectPath.includes('{role}') && role) {
        redirectPath = redirectPath.replace('{role}', role);
      }

      // Perform 301-style redirect (replace in history)
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, role, navigate]);

  return null;
}
