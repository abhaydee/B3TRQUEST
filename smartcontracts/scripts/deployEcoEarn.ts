import { ethers } from "hardhat";

async function main() {
  // Deploy Token contract first
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(deployer.address);
  await token.deployed();

  console.log("Token contract deployed to:", token.address);

  // Deploy EcoEarn contract
  const EcoEarn = await ethers.getContractFactory("EcoEarn");
  const ecoEarn = await EcoEarn.deploy(
    deployer.address,
    token.address,
    6000, // Cycle duration in blocks
    5     // Max submissions per cycle
  );
  await ecoEarn.deployed();

  console.log("EcoEarn contract deployed to:", ecoEarn.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
