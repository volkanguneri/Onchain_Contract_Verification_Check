const { readJavascript, readConfig } = require("/root/ContractVerificatonCheck/packages/hardhat/chainlink/lib/utils");
const hre = require("hardhat");

// Retrieve parameters from the configuration file based on the chainId
const chainId = 84532;
const { router, subscriptionId, donId } = readConfig(chainId);

// Other parameters
const javascript = readJavascript("httpRequest.js");
const gasLimit = 300000;
  
// Convert the string to bytes32
const donIdHex = hre.ethers.utils.formatBytes32String(donId);

console.log("🚀 ~ router:", router);
console.log("🚀 ~ javascript:", javascript);
console.log("🚀 ~ subscriptionId:", subscriptionId);
console.log("🚀 ~ gasLimit:", gasLimit);
console.log("🚀 ~ donIdHex:", donIdHex);

module.exports = [
    router,
    javascript,
    subscriptionId,
    gasLimit,
    donIdHex,
];
