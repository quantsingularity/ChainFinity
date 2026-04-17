module.exports = {
  extends: ["react-app", "react-app/jest"],
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
};
