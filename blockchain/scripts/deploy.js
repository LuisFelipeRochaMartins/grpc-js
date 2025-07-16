const hre = require("hardhat");

async function main() {
  const CarSales = await hre.ethers.getContractFactory("CarSales");
  const carSales = await CarSales.deploy();

  await carSales.waitForDeployment();

  console.log(`CarSales deployed to: ${await carSales.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});