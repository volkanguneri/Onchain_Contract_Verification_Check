// Ensure that basescanAPIKey is set in your environment variables
if (!secrets.basescanAPIKey) {
  throw new Error("Need basescanAPIKey environment variable");
}

let verified = false;

// Contract address to check
const contractAddress = args[0];
if(contractAddress && contractAddress.trim() !== "") 
{
  console.log("Contract Address is not defined")
}

// API key for Block Explorer
const apiKey = secrets.basescanAPIKey; // Your Block Explorer API key
if(apiKey && apiKey.trim() !== "") 
  {
    console.log("Block Explorer API Key is not defined")
  }

try {
  // HTTP request to get the contract source code from Block Explorer on Base Sepolia network
  const basescanResponse = await Functions.makeHttpRequest({
      url: `https://api-sepolia.basescan.org/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
  });

  // Check if the HTTP request was successful
  if (basescanResponse.error) {
      console.log(`HTTP request failed: ${basescanResponse.error}`)
      throw new Error(`HTTP request failed: ${basescanResponse.error}`);
  }

  // Check if data and result are defined in the response
  const { result } = basescanResponse.data;
  if (result && result.length > 0) {
      const { SourceCode } = result[0];

      // Determine if the contract is verified
      if (SourceCode && SourceCode.trim() !== '') {
          verified = true;
      } else {
          verified = false; 
      }
  }
} catch (error) {
  console.error("Error during contract verification:", error.message);
}

// Return the encoded string based on the verification status
return Functions.encodeString(
  verified ? "This is a verified contract on Basescan" : "This is NOT a verified contract on Basescan"
);
