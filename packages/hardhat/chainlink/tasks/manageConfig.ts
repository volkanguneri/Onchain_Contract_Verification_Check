import { contractVerifierScope } from "./scope";
import { readConfig, writeConfig } from "../lib/utils";
import { ContractVerifier } from "../../typechain-types";
import AbiContractVerifier from "../abis/ContractVerifier.json";
import { types } from "hardhat/config";

contractVerifierScope
  .task("config", "Display [and update] ContractVerifier config")
  .addOptionalParam("donid", "Chainlink DON Id", undefined, types.int)
  .addOptionalParam("subid", "Chainlink Subscription Id", undefined, types.int)
  .addOptionalParam("router", "Chainlink router address", undefined, types.string)
  .addOptionalParam("explorer", "Chain explorer url", undefined, types.string)
  .addOptionalParam("chainname", "Chain name", undefined, types.string)
  .addOptionalParam("rpc", "Base Rpc url", undefined, types.string)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const config = readConfig(chainId);
    console.log("chainId", chainId);
    console.log(config);

    const [signer] = await hre.ethers.getSigners();
    const contractVerifier = (await hre.ethers.getContractAt(
      AbiContractVerifier,
      config.contractVerifier,
      signer,
    )) as unknown as ContractVerifier;
    console.log("🚀 ~ .setAction ~ contractVerifier:", contractVerifier);

    let update = false;

    // onchain config
    if (taskArgs.donid) {
      console.log("🚀 ~ .setAction ~ taskArgs.donid:", taskArgs.donid);
      if (taskArgs.donid != (await contractVerifier.donId())) {
        const tx = await contractVerifier.setDonID(taskArgs.donid);
        console.log("ContractVerifier setDonID Request", taskArgs.donid, `${config.explorer}/tx/${tx.hash}`);
        const res = await tx.wait();
        console.log("ContractVerifier setDonID Result", res?.status || "no status");
      }
      writeConfig(chainId, "donId", taskArgs.donid);
      update = true;
    }
    if (taskArgs.subid) {
      if (taskArgs.subid != (await contractVerifier.subscriptionId())) {
        const tx = await contractVerifier.setSubscriptionId(taskArgs.subid);
        console.log("ContractVerifier setSubscriptionId Request", taskArgs.subid, `${config.explorer}/tx/${tx.hash}`);
        const res = await tx.wait();
        console.log("ContractVerifier setSubscriptionId Result", res?.status || "no status");
      }
      writeConfig(chainId, "subscriptionId", taskArgs.subid);
      update = true;
    }
    if (taskArgs.router) {
      if (config.contractVerifier) console.error("Cannot update router after deployment, must redeploy");
      writeConfig(chainId, "router", taskArgs.router);
      update = true;
    }

    // offchain config
    if (taskArgs.explorer) {
      writeConfig(chainId, "explorer", taskArgs.explorer);
      update = true;
    }
    if (taskArgs.chainname) {
      writeConfig(chainId, "chainName", taskArgs.chainname);
      update = true;
    }
    if (taskArgs.rpc) {
      writeConfig(chainId, "rpc", taskArgs.rpc);
      update = true;
    }

    if (update) console.log(readConfig(chainId));
  });
