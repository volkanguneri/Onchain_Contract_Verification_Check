import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployScamHunterToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  try {
    // Fetch the deployed ContractVerifier contract
    const basescanCheckDeployment = await get("BasescanCheck");
    const basescanCheckAddress = basescanCheckDeployment.address;

    // Deploy the ScamHunterToken contract with the BasescanCheck address as a constructor argument
    await deploy("ScamHunterToken", {
      from: deployer,
      args: [basescanCheckAddress],
      log: true,
      // autoMine: true, // Uncomment if needed
    });
  } catch (error) {
    console.error("Error deploying ScamHunterToken:", error);
  }
};

export default deployScamHunterToken;

deployScamHunterToken.tags = ["ScamHunterToken"];
