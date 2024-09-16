if (!secrets.etherscanAPIKey) throw new Error("Need Etherscan_API_Key environment variable");

let verified = false;

// Gets the contract address temporarily defined in request-config.js.
const contractAddress = args[0];

// HTTP request to get the contract if verified on Etherscan.
const etherscanResponse = await Functions.makeHttpRequest({ 
    url: `https://api-sepolia.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${secrets.etherscanAPIKey}`,
});

// Check if the HTTP request was successful
if (etherscanResponse.error) {
    throw new Error(`HTTP request failed: ${etherscanResponse.error}`);
}

// Check if the contract source code is verified
const result = etherscanResponse.data.result[0];
if (result.SourceCode && result.SourceCode.trim() !== '') {
    verified = true;
} 

// Return the encoded string based on the verification status
return Functions.encodeString(verified ? "This is a verified contract on Etherscan" : "This is NOT a verified contract on Etherscan");
