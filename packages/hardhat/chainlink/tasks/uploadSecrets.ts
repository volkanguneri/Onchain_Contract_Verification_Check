// Use env-enc from Chainlink to encrypt secrets on hard disk
import { config as decodeConfig } from "@chainlink/env-enc";
decodeConfig();

import { ethers } from "ethers-v5";
import { types } from "hardhat/config";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { contractVerifierScope } from "./scope";
import { ContractVerifier } from "../../typechain-types"; // Updated type
import AbiContractVerifier from "../abis/ContractVerifier.json"; // Updated ABI
import { readConfig } from "../lib/utils";

// Task to upload ContractVerifier secrets to Chainlink
contractVerifierScope
  .task("secrets", "Upload ContractVerifier secrets to Chainlink")
  .addOptionalParam("expiration", "Expiration time in minutes of uploaded secrets", 60, types.int)
  .setAction(async (taskArgs, hre) => {
    const chainId = await hre.getChainId();
    const { rpc, router, donId, explorer } = readConfig(chainId);

    const gatewayUrls = [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/",
    ];

    const slotIdNumber = 0;
    const expiration = taskArgs.expiration;
    const secrets = { etherscanAPIKey: process.env.ETHERSCAN_API_KEY || "" };

    const rpcUrl = `${rpc}/${process.env.ALCHEMY_API_KEY}`;
    if (!rpcUrl) throw new Error(`rpcUrl not provided - check your environment variables`);

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) throw new Error("private key not provided - check your environment variables");

    // Create v5 provider with rpc url
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);

    // Encrypt secrets
    const secretsManager = new SecretsManager({
      signer: signer,
      functionsRouterAddress: router,
      donId: donId,
    });
    await secretsManager.initialize();
    const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);
    console.log("🚀 ~ .setAction ~ encryptedSecretsObj:", encryptedSecretsObj);

    console.log(
      `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}. Expiration in minutes: ${expiration}`,
    );

    // Upload secrets to the DON
    const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
      encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
      gatewayUrls: gatewayUrls,
      slotId: slotIdNumber,
      minutesUntilExpiration: expiration,
    });
    if (!uploadResult.success) throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

    console.log(`\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `, uploadResult);

    // Update onchain `donHostedSecretsVersion`
    if (uploadResult.success) {
      const [signer] = await hre.ethers.getSigners();
      const contractVerifier = (await hre.ethers.getContractAt(
        AbiContractVerifier,
        readConfig(chainId).contractVerifier, // Updated contract address
        signer,
      )) as unknown as ContractVerifier;

      // Update onchain `donHostedSecretsVersion`
      const tx = await contractVerifier.setDonHostedSecretsVersion(uploadResult.version);
      console.log("setDonHostedSecretsVersion Request", uploadResult.version, `${explorer}/tx/${tx.hash}`);
      const res = await tx.wait();
      console.log("setDonHostedSecretsVersion Result", res?.status || "no status");
    }
  });
