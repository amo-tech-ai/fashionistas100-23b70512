/**
 * Centralized role definitions and access control
 * MUST match the user_role enum in Supabase
 */

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  DESIGNER: 'designer',
  VENUE_OWNER: 'venue_owner',
  SPONSOR: 'sponsor',
  ATTENDEE: 'attendee',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Dashboard access control matrix
 * Maps dashboard type to allowed roles
 */
export const DASHBOARD_ACCESS: Record<string, Role[]> = {
  admin: [ROLES.ADMIN],
  organizer: [ROLES.ORGANIZER, ROLES.ADMIN],
  designer: [ROLES.DESIGNER, ROLES.ADMIN],
  venue: [ROLES.VENUE_OWNER, ROLES.ADMIN],
  sponsor: [ROLES.SPONSOR, ROLES.ADMIN],
  user: [ROLES.ATTENDEE, ROLES.ADMIN],
};

/**
 * Role-to-dashboard routing map
 */
export const ROLE_DASHBOARD_MAP: Record<Role, string> = {
  [ROLES.ADMIN]: '/dashboard/admin/overview',
  [ROLES.ORGANIZER]: '/dashboard/organizer/overview',
  [ROLES.DESIGNER]: '/dashboard/designer/overview',
  [ROLES.VENUE_OWNER]: '/dashboard/venue/overview',
  [ROLES.SPONSOR]: '/dashboard/sponsor/overview',
  [ROLES.ATTENDEE]: '/dashboard/user/overview',
};

/**
 * Check if a role has access to a specific dashboard
 */
export function hasAccess(userRole: Role | null, allowedRoles: Role[]): boolean {
  return userRole !== null && allowedRoles.includes(userRole);
}

/**
 * Get dashboard path for a given role
 */
export function getDashboardPath(role: Role | null): string {
  if (!role) return '/sign-in';
  return ROLE_DASHBOARD_MAP[role] || '/dashboard';
}
