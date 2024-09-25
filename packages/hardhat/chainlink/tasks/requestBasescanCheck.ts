import { BasescanCheck } from "../../typechain-types";
import { basescanCheckScope } from "./scope";
import AbiBasescanCheck from "../abis/BasescanCheck.json";
import { readConfig } from "../lib/utils";
import { types } from "hardhat/config";

basescanCheckScope
  .task("request", "Read last BasescanCheck response [and send BasescanCheck request]")
  .addOptionalParam("prompt", "OpenAI prompt request for Chainlink", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);

    const [signer] = await hre.ethers.getSigners();
    const basescanCheck = (await hre.ethers.getContractAt(
      AbiBasescanCheck,
      config.basescanCheck,
      signer,
    )) as unknown as BasescanCheck; // Remplacer OnChainAI par BasescanCheck

    console.log(`lastUserPrompt '${await basescanCheck.lastUserPrompt()}'`);
    console.log(`lastResponse   '${await basescanCheck.lastResponse()}'`);
    console.log(`lastError      '${await basescanCheck.lastError()}'`);

    if (taskArgs.prompt) {
      const tx = await basescanCheck.sendRequest(taskArgs.prompt, { value: 2_000_000_000_000_000 });
      console.log("BasescanCheck Request", `'${taskArgs.prompt}'`, `${config.explorer}/tx/${tx.hash}`);
      const res = await tx.wait();
      console.log("BasescanCheck Result", res?.status || "no status");
    }
  });
