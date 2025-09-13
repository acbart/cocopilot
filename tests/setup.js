import '@testing-library/jest-dom';

// Mock service worker registration
global.navigator = {
  ...global.navigator,
  serviceWorker: {
    register: jest.fn(() => Promise.resolve({
      scope: '/'
    }))
  },
  onLine: true
};

// Mock fetch API
global.fetch = jest.fn();

// Mock DOM APIs
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});