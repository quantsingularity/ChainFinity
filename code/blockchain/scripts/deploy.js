// Deployment helper for ChainFinity contracts (Hardhat 2 + ethers v6).
const hre = require("hardhat");

async function deployAssetVault() {
  const ethers = hre.ethers;
  const [admin, operator, emergency, feeCollector] = await ethers.getSigners();

  const Vault = await ethers.getContractFactory("AssetVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();

  await (
    await vault.initialize(
      admin.address,
      operator.address,
      emergency.address,
      feeCollector.address,
    )
  ).wait();

  return { vault, admin, operator, emergency, feeCollector };
}

async function main() {
  const { vault } = await deployAssetVault();
  console.log("AssetVault deployed to:", await vault.getAddress());
}

module.exports = { deployAssetVault, main };

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
