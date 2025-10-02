import { test, expect } from '@playwright/test';

/**
 * Horizontal Scroll Detection Tests
 * 
 * Validates no horizontal scrolling on any page/viewport
 * Target: 0 horizontal scroll issues
 */

const pages = [
  '/',
  '/events',
  '/dashboard',
  '/dashboard/sponsors',
  '/dashboard/bookings',
  '/contact',
];

const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPhone 13 Pro Max', width: 428, height: 926 },
  { name: 'Galaxy S21', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
];

test.describe('Horizontal Scroll Detection (0 Issues)', () => {
  
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}px)`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const url of pages) {
        test(`no horizontal scroll on ${url}`, async ({ page }) => {
          await page.goto(url);
          await page.waitForLoadState('networkidle');
          
          // Wait for any animations to complete
          await page.waitForTimeout(500);

          // Check document width
          const documentWidth = await page.evaluate(() => {
            return Math.max(
              document.body.scrollWidth,
              document.documentElement.scrollWidth,
              document.body.offsetWidth,
              document.documentElement.offsetWidth,
              document.body.clientWidth,
              document.documentElement.clientWidth
            );
          });

          console.log(`${url} on ${viewport.name}: document width = ${documentWidth}px, viewport = ${viewport.width}px`);

          // Allow 1px tolerance for rounding
          expect(documentWidth).toBeLessThanOrEqual(viewport.width + 1);
        });

        test(`no overflowing elements on ${url}`, async ({ page }) => {
          await page.goto(url);
          await page.waitForLoadState('networkidle');
          
          const overflowingElements = await page.evaluate((viewportWidth) => {
            const elements = document.querySelectorAll('*');
            const overflowing: Array<{ tag: string; width: number; class: string }> = [];

            elements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              
              // Check if element extends beyond viewport
              if (rect.right > viewportWidth) {
                overflowing.push({
                  tag: el.tagName,
                  width: rect.width,
                  class: el.className.toString(),
                });
              }
            });

            return overflowing;
          }, viewport.width);

          if (overflowingElements.length > 0) {
            console.error(`Overflowing elements on ${url} (${viewport.name}):`, overflowingElements.slice(0, 5));
          }

          expect(overflowingElements).toEqual([]);
        });
      }
    });
  }

  test.describe('Edge Cases', () => {
    test('tables do not cause horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard/sponsors');
      await page.waitForLoadState('networkidle');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });

    test('images do not cause horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/events');
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const box = await images.nth(i).boundingBox();
        if (box) {
          expect(box.x + box.width).toBeLessThanOrEqual(375);
        }
      }
    });

    test('forms do not cause horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });
  });

  test.describe('Responsive Breakpoints', () => {
    const breakpoints = [320, 375, 414, 768, 1024, 1280, 1920];

    for (const width of breakpoints) {
      test(`no horizontal scroll at ${width}px breakpoint`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        
        console.log(`Breakpoint ${width}px: body width = ${bodyWidth}px`);
        expect(bodyWidth).toBeLessThanOrEqual(width + 1);
      });
    }
  });
});
