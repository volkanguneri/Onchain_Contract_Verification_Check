// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// // import { readConfig } from "../chainlink/lib/utils";
// // import { ethers } from "hardhat";

// const deployScamHunterToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy } = hre.deployments;

//   // const chainId = await hre.getChainId();

//   // // Fetch the OnChainAI address from the config
//   // const { onChainAI } = readConfig(chainId);

//   // if (!onChainAI) {
//   //   throw new Error("OnChainAI address is not found in the config.");
//   // }

//   const onChainAI = "0xbfFE7bC0A26FfE6f7882ABb6B7C4f299A5138E66";

//   // // Convert ETH to Wei using ethers.utils
//   // const valueInWei = hre.ethers.parseEther("0.04");
//   // console.log(typeof valueInWei, valueInWei);

//   await deploy("ScamHunterToken", {
//     from: deployer,
//     // Pass the OnChainAI address to the constructor
//     args: [onChainAI],
//     log: true,
//     autoMine: true,
//   });
// };

// export default deployScamHunterToken;

// deployScamHunterToken.tags = ["ScamHunterToken"];

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployScamHunterToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // Fetch the deployed OnChainAI contract
  const onChainAIDeployment = await get("OnChainAI");
  const onChainAIAddress = onChainAIDeployment.address;

  // Log the address (for debugging purposes)
  console.log("OnChainAI deployed at:", onChainAIAddress);

  // Deploy the ScamHunterToken contract with the OnChainAI address as a constructor argument
  await deploy("ScamHunterToken", {
    from: deployer,
    args: [onChainAIAddress],
    log: true,
    autoMine: true,
  });
};

export default deployScamHunterToken;

deployScamHunterToken.tags = ["ScamHunterToken"];
