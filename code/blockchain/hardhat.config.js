require("@nomicfoundation/hardhat-toolbox");

/**
 * Hardhat 2 (CommonJS) configuration.
 *
 * The previous configuration combined hardhat ^3 with `"type": "module"` and
 * OpenZeppelin ^5 while every contract in this repository targets the
 * OpenZeppelin v4 API (security/ paths, SafeMath, Counters, IGovernor
 * override lists) - nothing compiled. Dependencies are now pinned to the
 * versions the contracts are written against.
 */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};
