import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployScamHunterToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  try {
    // Fetch the deployed ContractVerifier contract
    const contractVerifierDeployment = await get("ContractVerifier");
    const contractVerifierAddress = contractVerifierDeployment.address;

    // Deploy the ScamHunterToken contract with the ContractVerifier address as a constructor argument
    await deploy("ScamHunterToken", {
      from: deployer,
      args: [contractVerifierAddress],
      log: true,
      // autoMine: true, // Uncomment if needed
    });
  } catch (error) {
    console.error("Error deploying ScamHunterToken:", error);
  }
};

export default deployScamHunterToken;

deployScamHunterToken.tags = ["ScamHunterToken"];
