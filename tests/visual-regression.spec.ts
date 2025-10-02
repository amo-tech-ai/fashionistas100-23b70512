import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests
 * 
 * Captures screenshots for visual comparison
 * Useful for detecting unintended UI changes
 */

const pages = [
  { name: 'home', url: '/' },
  { name: 'events', url: '/events' },
  { name: 'dashboard-sponsors', url: '/dashboard/sponsors' },
  { name: 'dashboard-bookings', url: '/dashboard/bookings' },
];

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('Visual Regression', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} viewport`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const page of pages) {
        test(`${page.name} page screenshot`, async ({ page: browserPage }) => {
          await browserPage.goto(page.url);
          await browserPage.waitForLoadState('networkidle');
          
          // Wait for any animations to complete
          await browserPage.waitForTimeout(500);
          
          // Take screenshot
          await expect(browserPage).toHaveScreenshot(
            `${page.name}-${viewport.name}.png`,
            {
              fullPage: true,
              animations: 'disabled',
            }
          );
        });
      }
    });
  }
});
