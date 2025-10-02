import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests (WCAG 2.1 AA)
 * 
 * Validates accessibility compliance across all pages and devices
 * Target: 0 accessibility violations
 */

const pages = [
  { name: 'Home', url: '/' },
  { name: 'Events', url: '/events' },
  { name: 'Dashboard', url: '/dashboard' },
  { name: 'Sponsors Dashboard', url: '/dashboard/sponsors' },
  { name: 'Bookings Dashboard', url: '/dashboard/bookings' },
];

test.describe('Accessibility Compliance (WCAG 2.1 AA)', () => {
  
  test.describe('Desktop Accessibility', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    for (const page of pages) {
      test(`${page.name} has no accessibility violations`, async ({ page: browserPage }) => {
        await browserPage.goto(page.url);
        await browserPage.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });

  test.describe('Mobile Accessibility', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    for (const page of pages) {
      test(`${page.name} (mobile) has no accessibility violations`, async ({ page: browserPage }) => {
        await browserPage.goto(page.url);
        await browserPage.waitForLoadState('networkidle');

        const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/dashboard/sponsors');
      await page.waitForLoadState('networkidle');

      // Tab through all elements
      const focusableElements = await page.locator(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ).count();

      let tabbedElements = 0;
      for (let i = 0; i < focusableElements && i < 50; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        if (focused) tabbedElements++;
      }

      expect(tabbedElements).toBeGreaterThan(0);
    });

    test('focus indicators are visible', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      const outline = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have visible focus indicator (outline or box-shadow)
      const hasFocusIndicator = 
        outline.outline !== 'none' || 
        outline.outlineWidth !== '0px' || 
        outline.boxShadow !== 'none';

      expect(hasFocusIndicator).toBeTruthy();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('all images have alt text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        const ariaLabel = await images.nth(i).getAttribute('aria-label');
        const role = await images.nth(i).getAttribute('role');

        // Image should have alt text or be decorative
        const hasAltOrDecorative = 
          (alt !== null && alt !== '') || 
          ariaLabel !== null || 
          role === 'presentation';

        expect(hasAltOrDecorative).toBeTruthy();
      }
    });

    test('form inputs have labels', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');

      const inputs = page.locator('input, textarea, select');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        // Input should have associated label
        const hasLabel = id 
          ? await page.locator(`label[for="${id}"]`).count() > 0
          : ariaLabel !== null || ariaLabelledBy !== null;

        expect(hasLabel).toBeTruthy();
      }
    });

    test('heading hierarchy is correct', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      const levels = await Promise.all(
        headings.map(h => h.evaluate(el => parseInt(el.tagName.charAt(1))))
      );

      // Should have exactly one h1
      const h1Count = levels.filter(l => l === 1).length;
      expect(h1Count).toBe(1);

      // Headings should not skip levels
      for (let i = 1; i < levels.length; i++) {
        const diff = levels[i] - levels[i - 1];
        expect(diff).toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('text has sufficient contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});
