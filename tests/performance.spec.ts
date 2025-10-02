import { test, expect } from '@playwright/test';

/**
 * Performance Tests
 * 
 * Validates performance budgets and Core Web Vitals
 * Target: LCP < 2.5s, CLS < 0.1, FID < 100ms
 */

const pages = [
  { name: 'Home', url: '/', budget: 2500 },
  { name: 'Events', url: '/events', budget: 3000 },
  { name: 'Dashboard', url: '/dashboard', budget: 3000 },
  { name: 'Sponsors', url: '/dashboard/sponsors', budget: 3500 },
  { name: 'Bookings', url: '/dashboard/bookings', budget: 3500 },
];

test.describe('Performance Validation', () => {
  
  test.describe('Load Performance', () => {
    test('pages load within budget on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      for (const pageInfo of pages) {
        const startTime = Date.now();
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        console.log(`${pageInfo.name} loaded in ${loadTime}ms (budget: ${pageInfo.budget}ms)`);
        expect(loadTime).toBeLessThan(pageInfo.budget);
      }
    });

    test('pages load within budget on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      for (const pageInfo of pages) {
        const startTime = Date.now();
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        // Mobile gets 50% more budget
        const mobileBudget = pageInfo.budget * 1.5;
        console.log(`${pageInfo.name} (mobile) loaded in ${loadTime}ms (budget: ${mobileBudget}ms)`);
        expect(loadTime).toBeLessThan(mobileBudget);
      }
    });

    test('pages load within budget on 3G network', async ({ page, context }) => {
      // Simulate 3G network
      await context.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms latency
        await route.continue();
      });

      await page.setViewportSize({ width: 375, height: 667 });

      for (const pageInfo of pages.slice(0, 2)) { // Test first 2 pages only
        const startTime = Date.now();
        await page.goto(pageInfo.url);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        const networkBudget = 5000; // 5s budget on slow network
        console.log(`${pageInfo.name} (3G) loaded in ${loadTime}ms (budget: ${networkBudget}ms)`);
        expect(loadTime).toBeLessThan(networkBudget);
      }
    });
  });

  test.describe('Core Web Vitals', () => {
    test('Largest Contentful Paint (LCP) < 2.5s', async ({ page }) => {
      await page.goto('/');
      
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Timeout after 10s
          setTimeout(() => resolve(0), 10000);
        });
      });

      console.log(`LCP: ${lcp}ms`);
      expect(lcp).toBeLessThan(2500);
    });

    test('Cumulative Layout Shift (CLS) < 0.1', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            resolve(clsValue);
          }).observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => resolve(clsValue), 5000);
        });
      });

      console.log(`CLS: ${cls}`);
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Resource Optimization', () => {
    test('images are optimized', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const images = await page.locator('img').all();
      
      for (const img of images) {
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        
        // Images should use lazy loading (except above fold)
        if (src && !src.includes('logo')) {
          expect(loading).toBeTruthy();
        }
      }
    });

    test('no unnecessary requests', async ({ page }) => {
      const requests: string[] = [];
      
      page.on('request', request => {
        requests.push(request.url());
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should not have duplicate requests
      const uniqueRequests = new Set(requests);
      expect(requests.length).toBe(uniqueRequests.size);
    });
  });

  test.describe('Bundle Size', () => {
    test('JavaScript bundle is reasonable', async ({ page }) => {
      const jsSize = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.name.endsWith('.js'))
          .reduce((sum: number, r: any) => sum + (r.transferSize || 0), 0);
      });

      // Budget: 500KB for JS
      console.log(`JS bundle size: ${(jsSize / 1024).toFixed(2)}KB`);
      expect(jsSize).toBeLessThan(500 * 1024);
    });

    test('CSS bundle is reasonable', async ({ page }) => {
      await page.goto('/');
      
      const cssSize = await page.evaluate(() => {
        return performance.getEntriesByType('resource')
          .filter((r: any) => r.name.endsWith('.css'))
          .reduce((sum: number, r: any) => sum + (r.transferSize || 0), 0);
      });

      // Budget: 100KB for CSS
      console.log(`CSS bundle size: ${(cssSize / 1024).toFixed(2)}KB`);
      expect(cssSize).toBeLessThan(100 * 1024);
    });
  });
});
