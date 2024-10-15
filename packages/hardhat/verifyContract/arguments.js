const { readJavascript, readConfig } = require("/root/ContractVerificatonCheck/packages/hardhat/chainlink/lib/utils");
const { ethers } = require("hardhat");

// Récupérer les paramètres depuis le fichier de configuration en fonction du chainId
const chainId = 84532;
const { router, subscriptionId, donId} = readConfig(chainId);

// Autres paramètres
const javascript = readJavascript("httpRequest.js");
const gasLimit = 300000;

// Convertir la chaîne en bytes32
const donIdHex = ethers.utils.formatBytes32String(donId);

console.log("🚀 ~ donIdHex:", donIdHex);

module.exports = [
    router,
    javascript,
    subscriptionId,
    gasLimit,
    donIdHex,
];
