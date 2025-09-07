import { useState, useEffect } from 'react';

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const useSidebar = (): SidebarState => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Try to get initial state from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fashionos-sidebar-collapsed');
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fashionos-sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  const toggle = () => setIsCollapsed(prev => !prev);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return {
    isCollapsed,
    toggle,
    collapse,
    expand
  };
};