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

// Mock expo-linear-gradient as a plain View so the UI kit renders in tests.
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, ...props }) =>
      React.createElement(View, props, children),
  };
});

// Mock react-native-safe-area-context to avoid needing a provider in unit tests.
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    SafeAreaView: ({ children, ...props }) =>
      React.createElement(View, props, children),
    useSafeAreaInsets: () => inset,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});
