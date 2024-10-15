import { VerificationCheck } from "../../typechain-types";
import { verificationCheckScope } from "./scope";
import AbiVerificationCheck from "../abis/VerificationCheck.json";
import { readConfig } from "../lib/utils";
import { types } from "hardhat/config";

verificationCheckScope
  .task("request", "Read last VerificationCheck response [and send VerificationCheck request]")
  .addOptionalParam("prompt", "Basescan prompt request for Chainlink", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);

    const [signer] = await hre.ethers.getSigners();
    const verificationCheck = (await hre.ethers.getContractAt(
      AbiVerificationCheck,
      config.verificationCheck,
      signer,
    )) as unknown as VerificationCheck; // Remplacer OnChainAI par VerificationCheck

    console.log(`lastUserPrompt '${await verificationCheck.lastUserPrompt()}'`);
    console.log(`lastResponse   '${await verificationCheck.lastResponse()}'`);
    console.log(`lastError      '${await verificationCheck.lastError()}'`);

    if (taskArgs.prompt) {
      const tx = await verificationCheck.sendRequest(taskArgs.prompt, { value: 2_000_000_000_000_000 });
      console.log("VerificationCheck Request", `'${taskArgs.prompt}'`, `${config.explorer}/tx/${tx.hash}`);
      const res = await tx.wait();
      console.log("VerificationCheck Result", res?.status || "no status");
    }
  });
