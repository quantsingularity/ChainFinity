// Jest setup for the Expo app.

// In-memory AsyncStorage mock (official mock from the package).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// expo-router navigation mock for unit tests.
jest.mock("expo-router", () => {
  const React = require("react");
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    usePathname: () => "/",
    Link: ({ children }) => React.createElement(React.Fragment, null, children),
    Redirect: () => null,
    Stack: Object.assign(({ children }) => children, {
      Screen: () => null,
    }),
  };
});
