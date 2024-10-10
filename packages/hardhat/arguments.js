const { readJavascript, readConfig } = require("/root/BasescanCheck/packages/hardhat/chainlink/lib/utils");

const chainId = 84532;
const { router, subscriptionId} = readConfig(chainId);
const javascript = readJavascript("verificationCheck.js");
const gasLimit = 300000;
const donIdHex = "0x66756e2d626173652d7365706f6c69612d310000000000000000000000000000";

module.exports = [
    router,
    javascript,
    subscriptionId,
    gasLimit,
    donIdHex,
];