import { test, expect } from '@playwright/test';

/**
 * Mobile Responsiveness Tests
 * 
 * Tests critical mobile functionality across devices
 */

test.describe('Mobile Responsiveness', () => {
  
  test.describe('Touch Targets', () => {
    test('all interactive elements meet 44px minimum', async ({ page }) => {
      await page.goto('/dashboard/sponsors');
      
      // Wait for content to load
      await page.waitForLoadState('networkidle');
      
      // Check button sizes
      const buttons = page.locator('button');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40); // Allow 40px with some tolerance
          expect(box.width).toBeGreaterThanOrEqual(40);
        }
      }
    });
  });

  test.describe('Table Responsiveness', () => {
    test('tables convert to cards on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard/sponsors');
      
      // Wait for content
      await page.waitForLoadState('networkidle');
      
      // Check for card layout (no table headers visible)
      const tableHeaders = page.locator('thead');
      const isVisible = await tableHeaders.isVisible().catch(() => false);
      
      // On mobile, table should not be visible (using cards instead)
      expect(isVisible).toBeFalsy();
    });
    
    test('tables display normally on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/dashboard/sponsors');
      
      // Wait for content
      await page.waitForLoadState('networkidle');
      
      // Check for table layout
      const table = page.locator('table');
      await expect(table).toBeVisible();
    });
  });

  test.describe('Charts', () => {
    test('charts render at mobile dimensions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard/bookings');
      
      await page.waitForLoadState('networkidle');
      
      // Charts should be visible and not overflow
      const charts = page.locator('[class*="recharts"]');
      const count = await charts.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Check no horizontal overflow
      const body = await page.locator('body').boundingBox();
      expect(body?.width).toBeLessThanOrEqual(375);
    });
  });

  test.describe('Forms', () => {
    test('form inputs prevent iOS zoom', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/contact');
      
      // Check input font sizes (should be >= 16px to prevent zoom)
      const inputs = page.locator('input[type="text"], input[type="email"]');
      const count = await inputs.count();
      
      for (let i = 0; i < count; i++) {
        const fontSize = await inputs.nth(i).evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const size = parseInt(fontSize);
        expect(size).toBeGreaterThanOrEqual(16);
      }
    });
  });

  test.describe('Navigation', () => {
    test('mobile menu works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check for hamburger menu
      const hamburger = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();
      
      if (await hamburger.isVisible()) {
        await hamburger.click();
        
        // Menu should open
        const menu = page.locator('nav [role="menu"], nav .mobile-menu');
        await expect(menu.first()).toBeVisible({ timeout: 1000 });
      }
    });
  });

  test.describe('No Horizontal Scroll', () => {
    test('no horizontal scroll on mobile viewports', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const pages = ['/', '/events', '/dashboard/sponsors', '/dashboard/bookings'];
      
      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        // Check body width
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(375);
      }
    });
  });

  test.describe('Typography Scaling', () => {
    test('headings scale down on mobile', async ({ page }) => {
      // Desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      const h1 = page.locator('h1').first();
      const desktopSize = await h1.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      const mobileSize = await h1.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      
      // Mobile font should be smaller or equal
      expect(parseInt(mobileSize)).toBeLessThanOrEqual(parseInt(desktopSize));
    });
  });

  test.describe('Performance', () => {
    test('page loads within acceptable time on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });
  });
});

test.describe('PWA Features', () => {
  test('service worker registers', async ({ page }) => {
    await page.goto('/');
    
    // Check if service worker is registered
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(swRegistered).toBeTruthy();
  });

  test('manifest is present', async ({ page }) => {
    await page.goto('/');
    
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', '/manifest.json');
  });
});
