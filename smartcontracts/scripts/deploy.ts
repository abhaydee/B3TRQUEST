import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const GameRoomFactory = await ethers.getContractFactory("Token");
  
  const gameRoom = await GameRoomFactory.deploy(deployer.address);


  await gameRoom.getDeployedCode();

  console.log("GameRoom contract deployed to:", gameRoom.getAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
