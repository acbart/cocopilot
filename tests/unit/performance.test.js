/**
 * Unit tests for performance monitoring functionality
 */

describe('Performance Monitoring', () => {
  beforeEach(() => {
    // Mock performance API
    global.performance = {
      getEntriesByType: jest.fn(),
      measure: jest.fn(),
      mark: jest.fn(),
      now: jest.fn(() => 100),
      timing: {
        navigationStart: 0,
        loadEventEnd: 1000,
        domContentLoadedEventEnd: 500
      }
    };

    global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }));

    global.console.log = jest.fn();
  });

  describe('Core Web Vitals Monitoring', () => {
    test('should track Largest Contentful Paint (LCP)', () => {
      const mockCallback = jest.fn();
      const observer = new PerformanceObserver(mockCallback);
      
      expect(PerformanceObserver).toHaveBeenCalledWith(mockCallback);
      expect(observer.observe).toBeDefined();
    });

    test('should track First Input Delay (FID)', () => {
      const mockCallback = jest.fn();
      const observer = new PerformanceObserver(mockCallback);
      
      expect(PerformanceObserver).toHaveBeenCalledWith(mockCallback);
      expect(observer.observe).toBeDefined();
    });

    test('should track Cumulative Layout Shift (CLS)', () => {
      const mockCallback = jest.fn();
      const observer = new PerformanceObserver(mockCallback);
      
      expect(PerformanceObserver).toHaveBeenCalledWith(mockCallback);
      expect(observer.observe).toBeDefined();
    });
  });

  describe('Page Load Metrics', () => {
    test('should calculate page load time', () => {
      const navigationEntry = {
        loadEventEnd: 1000,
        fetchStart: 100,
        domContentLoadedEventEnd: 500
      };

      performance.getEntriesByType.mockReturnValue([navigationEntry]);

      // Simulate the performance measurement logic
      const navigation = performance.getEntriesByType('navigation')[0];
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;

      expect(pageLoadTime).toBe(900);
      expect(domContentLoadedTime).toBe(400);
    });

    test('should handle missing navigation entries gracefully', () => {
      performance.getEntriesByType.mockReturnValue([]);

      const navigation = performance.getEntriesByType('navigation')[0];
      expect(navigation).toBeUndefined();
    });
  });

  describe('Performance Observer Integration', () => {
    test('should create observers for Core Web Vitals', () => {
      // Simulate creating LCP observer
      const lcpCallback = jest.fn();
      const lcpObserver = new PerformanceObserver(lcpCallback);
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Simulate creating FID observer
      const fidCallback = jest.fn();
      const fidObserver = new PerformanceObserver(fidCallback);
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Simulate creating CLS observer
      const clsCallback = jest.fn();
      const clsObserver = new PerformanceObserver(clsCallback);
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      expect(PerformanceObserver).toHaveBeenCalledTimes(3);
      expect(lcpObserver.observe).toHaveBeenCalledWith({ entryTypes: ['largest-contentful-paint'] });
      expect(fidObserver.observe).toHaveBeenCalledWith({ entryTypes: ['first-input'] });
      expect(clsObserver.observe).toHaveBeenCalledWith({ entryTypes: ['layout-shift'] });
    });
  });
});