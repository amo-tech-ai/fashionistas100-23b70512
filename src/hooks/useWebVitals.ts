import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsConfig {
  reportUrl?: string;
  debug?: boolean;
  onMetric?: (metric: Metric) => void;
}

/**
 * useWebVitals Hook
 * 
 * Monitors Core Web Vitals and reports performance metrics
 * 
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift): < 0.1 (good), < 0.25 (needs improvement)
 * - INP (Interaction to Next Paint): < 200ms (good), < 500ms (needs improvement)
 * - FCP (First Contentful Paint): < 1.8s (good), < 3s (needs improvement)
 * - LCP (Largest Contentful Paint): < 2.5s (good), < 4s (needs improvement)
 * - TTFB (Time to First Byte): < 800ms (good), < 1800ms (needs improvement)
 */
export const useWebVitals = (config: WebVitalsConfig = {}) => {
  const { reportUrl, debug = false, onMetric } = config;

  useEffect(() => {
    const reportMetric = (metric: Metric) => {
      // Log in debug mode
      if (debug) {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          entries: metric.entries,
        });
      }

      // Custom callback
      if (onMetric) {
        onMetric(metric);
      }

      // Send to analytics endpoint
      if (reportUrl) {
        const body = JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Use sendBeacon if available, otherwise fallback to fetch
        if (navigator.sendBeacon) {
          navigator.sendBeacon(reportUrl, body);
        } else {
          fetch(reportUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          }).catch(console.error);
        }
      }

      // Store in localStorage for dashboard
      try {
        const key = `webvitals_${metric.name}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({
          value: metric.value,
          rating: metric.rating,
          timestamp: Date.now(),
        });
        
        // Keep only last 100 entries
        if (existing.length > 100) {
          existing.shift();
        }
        
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (error) {
        console.error('[Web Vitals] Failed to store metric:', error);
      }
    };

    // Collect all Web Vitals
    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);

    if (debug) {
      console.log('[Web Vitals] Monitoring started');
    }
  }, [reportUrl, debug, onMetric]);
};

/**
 * Get stored Web Vitals metrics
 */
export const getStoredWebVitals = () => {
  try {
    const metrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
    const data: Record<string, any[]> = {};

    metrics.forEach((metric) => {
      const key = `webvitals_${metric}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        data[metric] = JSON.parse(stored);
      }
    });

    return data;
  } catch (error) {
    console.error('[Web Vitals] Failed to retrieve metrics:', error);
    return {};
  }
};

/**
 * Clear stored Web Vitals metrics
 */
export const clearWebVitals = () => {
  try {
    const metrics = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
    metrics.forEach((metric) => {
      localStorage.removeItem(`webvitals_${metric}`);
    });
  } catch (error) {
    console.error('[Web Vitals] Failed to clear metrics:', error);
  }
};

/**
 * Get Web Vitals summary
 */
export const getWebVitalsSummary = () => {
  const stored = getStoredWebVitals();
  const summary: Record<string, any> = {};

  Object.entries(stored).forEach(([metric, values]) => {
    if (values.length > 0) {
      const latestValue = values[values.length - 1].value;
      const latestRating = values[values.length - 1].rating;
      const average = values.reduce((sum, v) => sum + v.value, 0) / values.length;

      summary[metric] = {
        latest: latestValue,
        rating: latestRating,
        average: Math.round(average * 100) / 100,
        count: values.length,
      };
    }
  });

  return summary;
};

export default useWebVitals;
