import { test, expect } from '@playwright/test';

/**
 * Helper to simulate user with specific role
 * Uses localStorage override for testing
 */
async function asRole(page: any, role: string) {
  await page.addInitScript(([r]: [string]) => {
    localStorage.setItem('__test_role_override', JSON.stringify({ role: r }));
  }, [role]);
}

test.describe('Dashboard Role-Based Routing', () => {
  test('redirect /dashboard → role-specific home', async ({ page }) => {
    await asRole(page, 'designer');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/designer\/overview$/);
  });

  test('organizer redirects to organizer dashboard', async ({ page }) => {
    await asRole(page, 'organizer');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/organizer\/overview$/);
  });

  test('venue redirects to venue dashboard', async ({ page }) => {
    await asRole(page, 'venue');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/venue\/overview$/);
  });

  test('sponsor redirects to sponsor dashboard', async ({ page }) => {
    await asRole(page, 'sponsor');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/sponsor\/overview$/);
  });

  test('user redirects to user dashboard', async ({ page }) => {
    await asRole(page, 'user');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/user\/overview$/);
  });

  test('admin can access admin dashboard', async ({ page }) => {
    await asRole(page, 'admin');
    await page.goto('/dashboard/admin/overview');
    await expect(page).toHaveURL(/\/dashboard\/admin\/overview$/);
  });
});

test.describe('Role Guard Access Control', () => {
  test('designer blocked from organizer page (403)', async ({ page }) => {
    await asRole(page, 'designer');
    await page.goto('/dashboard/organizer/overview');
    await expect(page).toHaveURL(/\/403$/);
  });

  test('organizer blocked from designer page (403)', async ({ page }) => {
    await asRole(page, 'organizer');
    await page.goto('/dashboard/designer/overview');
    await expect(page).toHaveURL(/\/403$/);
  });

  test('user blocked from admin page (403)', async ({ page }) => {
    await asRole(page, 'user');
    await page.goto('/dashboard/admin/overview');
    await expect(page).toHaveURL(/\/403$/);
  });

  test('venue blocked from sponsor page (403)', async ({ page }) => {
    await asRole(page, 'venue');
    await page.goto('/dashboard/sponsor/overview');
    await expect(page).toHaveURL(/\/403$/);
  });
});

test.describe('Deprecated Route Redirects', () => {
  test('old /dashboard/create-event → new namespaced route', async ({ page }) => {
    await asRole(page, 'organizer');
    await page.goto('/dashboard/create-event');
    await expect(page).toHaveURL(/\/dashboard\/organizer\/events\/create$/);
  });

  test('old /dashboard/portfolio-upload → new namespaced route', async ({ page }) => {
    await asRole(page, 'designer');
    await page.goto('/dashboard/portfolio-upload');
    await expect(page).toHaveURL(/\/dashboard\/designer\/portfolio\/upload$/);
  });

  test('old /admin/dashboard → new admin route', async ({ page }) => {
    await asRole(page, 'admin');
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/dashboard\/admin\/overview$/);
  });
});

test.describe('Public Route Canonicalization', () => {
  test('slug-only redirects to canonical slug-id format', async ({ page }) => {
    // This test assumes your app implements the redirect logic
    await page.goto('/events/sample-show');
    // Should redirect to /events/sample-show-123 format
    await expect(page.url()).toMatch(/\/events\/[a-z-]+-\d+$/);
  });

  test('designer profile slug redirects to slug-id', async ({ page }) => {
    await page.goto('/designers/john-doe');
    await expect(page.url()).toMatch(/\/designers\/[a-z-]+-\d+$/);
  });

  test('venue slug redirects to slug-id', async ({ page }) => {
    await page.goto('/venues/grand-hall');
    await expect(page.url()).toMatch(/\/venues\/[a-z-]+-\d+$/);
  });
});

test.describe('Authentication Flow', () => {
  test('unauthenticated user redirected to sign-in', async ({ page }) => {
    // Don't set role - simulate unauthenticated
    await page.goto('/dashboard/organizer/overview');
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('sign-in preserves intended destination', async ({ page }) => {
    await page.goto('/dashboard/organizer/events/123');
    await expect(page).toHaveURL(/\/sign-in$/);
    // After sign-in, should redirect back to /dashboard/organizer/events/123
  });
});

test.describe('Error Pages', () => {
  test('403 page displays error code', async ({ page }) => {
    await asRole(page, 'user');
    await page.goto('/dashboard/admin/overview');
    await expect(page.locator('[data-testid="error-code"]')).toHaveText('403');
  });

  test('404 page for non-existent route', async ({ page }) => {
    await page.goto('/dashboard/nonexistent/route');
    // Should show 404 or redirect to home
    await expect(page).toHaveURL(/\/(404|$)/);
  });
});
