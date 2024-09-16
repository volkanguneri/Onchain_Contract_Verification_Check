import { ContractVerifier } from "../../typechain-types";
import { contractVerifierScope } from "./scope";
import AbiContractVerifier from "../abis/ContractVerifier.json";
import { readConfig } from "../lib/utils";
import { types } from "hardhat/config";

contractVerifierScope
  .task("request", "Read last ContractVerifier response [and send ContractVerifier request]")
  .addOptionalParam("prompt", "OpenAI prompt request for Chainlink", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);

    const [signer] = await hre.ethers.getSigners();
    const contractVerifier = (await hre.ethers.getContractAt(
      AbiContractVerifier,
      config.contractVerifier,
      signer,
    )) as unknown as ContractVerifier; // Remplacer OnChainAI par ContractVerifier

    console.log(`lastUserPrompt '${await contractVerifier.lastUserPrompt()}'`);
    console.log(`lastResponse   '${await contractVerifier.lastResponse()}'`);
    console.log(`lastError      '${await contractVerifier.lastError()}'`);

    if (taskArgs.prompt) {
      const tx = await contractVerifier.sendRequest(taskArgs.prompt, { value: 2_000_000_000_000_000 });
      console.log("ContractVerifier Request", `'${taskArgs.prompt}'`, `${config.explorer}/tx/${tx.hash}`);
      const res = await tx.wait();
      console.log("ContractVerifier Result", res?.status || "no status");
    }
  });
