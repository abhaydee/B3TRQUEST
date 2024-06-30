import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const GameRoomFactory = await ethers.getContractFactory("GameRoom");
  const gameRoom = await GameRoomFactory.deploy();

  await gameRoom.getDeployedCode();

  console.log("GameRoom contract deployed to:", gameRoom.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
