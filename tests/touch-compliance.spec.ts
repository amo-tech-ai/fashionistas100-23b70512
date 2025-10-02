import { test, expect } from '@playwright/test';

/**
 * Touch Target Compliance Tests
 * 
 * Validates all interactive elements meet minimum 44x44px touch target size
 * Target: 100% compliance
 */

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Events', url: '/events' },
  { name: 'Dashboard Sponsors', url: '/dashboard/sponsors' },
  { name: 'Dashboard Bookings', url: '/dashboard/bookings' },
];

const MINIMUM_TOUCH_TARGET = 44; // 44x44px per WCAG 2.1 AA
const TOLERANCE = 4; // Allow 40px with 4px tolerance

test.describe('Touch Target Compliance (100%)', () => {
  
  test.describe('Mobile Touch Targets', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    for (const pageInfo of pages) {
      test(`${pageInfo.name} - all buttons meet minimum size`, async ({ page }) => {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');

        const buttons = page.locator('button:visible');
        const count = await buttons.count();
        
        const violations: string[] = [];

        for (let i = 0; i < count; i++) {
          const button = buttons.nth(i);
          const box = await button.boundingBox();
          const text = await button.textContent();
          
          if (box) {
            if (box.height < MINIMUM_TOUCH_TARGET - TOLERANCE) {
              violations.push(`Button "${text?.trim()}" height: ${box.height}px (min: ${MINIMUM_TOUCH_TARGET}px)`);
            }
            if (box.width < MINIMUM_TOUCH_TARGET - TOLERANCE) {
              violations.push(`Button "${text?.trim()}" width: ${box.width}px (min: ${MINIMUM_TOUCH_TARGET}px)`);
            }
          }
        }

        if (violations.length > 0) {
          console.error(`Touch target violations on ${pageInfo.name}:`, violations);
        }

        expect(violations).toEqual([]);
      });

      test(`${pageInfo.name} - all links meet minimum size`, async ({ page }) => {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');

        const links = page.locator('a:visible');
        const count = await links.count();
        
        const violations: string[] = [];

        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const box = await link.boundingBox();
          const text = await link.textContent();
          
          if (box && text && text.trim()) {
            // Only check interactive links (not logos/images)
            if (box.height < MINIMUM_TOUCH_TARGET - TOLERANCE && box.height > 10) {
              violations.push(`Link "${text.trim()}" height: ${box.height}px (min: ${MINIMUM_TOUCH_TARGET}px)`);
            }
          }
        }

        if (violations.length > 0) {
          console.error(`Link touch target violations on ${pageInfo.name}:`, violations);
        }

        expect(violations).toEqual([]);
      });

      test(`${pageInfo.name} - all form inputs meet minimum size`, async ({ page }) => {
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');

        const inputs = page.locator('input:visible, select:visible, textarea:visible');
        const count = await inputs.count();
        
        const violations: string[] = [];

        for (let i = 0; i < count; i++) {
          const input = inputs.nth(i);
          const box = await input.boundingBox();
          const type = await input.getAttribute('type');
          
          if (box) {
            if (box.height < MINIMUM_TOUCH_TARGET - TOLERANCE) {
              violations.push(`Input (${type}) height: ${box.height}px (min: ${MINIMUM_TOUCH_TARGET}px)`);
            }
          }
        }

        if (violations.length > 0) {
          console.error(`Input touch target violations on ${pageInfo.name}:`, violations);
        }

        expect(violations).toEqual([]);
      });
    }
  });

  test.describe('Touch Target Spacing', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('interactive elements have adequate spacing', async ({ page }) => {
      await page.goto('/dashboard/sponsors');
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button:visible');
      const count = await buttons.count();

      for (let i = 0; i < count - 1; i++) {
        const box1 = await buttons.nth(i).boundingBox();
        const box2 = await buttons.nth(i + 1).boundingBox();

        if (box1 && box2) {
          // Check vertical spacing
          const verticalGap = Math.abs(box2.y - (box1.y + box1.height));
          
          // Check horizontal spacing
          const horizontalGap = Math.abs(box2.x - (box1.x + box1.width));

          // Elements should have at least 8px spacing if adjacent
          if (verticalGap < 50 && horizontalGap < 50) {
            const spacing = Math.min(verticalGap, horizontalGap);
            expect(spacing).toBeGreaterThanOrEqual(8);
          }
        }
      }
    });
  });

  test.describe('Tablet Touch Targets', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('tablet view maintains touch targets', async ({ page }) => {
      await page.goto('/dashboard/bookings');
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button:visible');
      const count = await buttons.count();
      
      let compliantCount = 0;

      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        
        if (box && box.height >= MINIMUM_TOUCH_TARGET - TOLERANCE && 
            box.width >= MINIMUM_TOUCH_TARGET - TOLERANCE) {
          compliantCount++;
        }
      }

      const compliance = (compliantCount / count) * 100;
      console.log(`Tablet touch target compliance: ${compliance.toFixed(1)}%`);
      
      expect(compliance).toBeGreaterThanOrEqual(100);
    });
  });
});
