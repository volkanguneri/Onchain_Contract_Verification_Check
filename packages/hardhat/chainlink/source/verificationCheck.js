// Ensure that basescanAPIKey is set in your environment variables
if (!secrets.basescanAPIKey) {
  throw new Error("Need basescanAPIKey environment variable");
}

let verified = false; // Initialize as false

// Contract address to check
const contractAddress = args[0];

// API key for Basescan
const apiKey = secrets.basescanAPIKey; // Your Basescan API key

try {
  // HTTP request to get the contract source code from Basescan on Sepolia network
  const basescanResponse = await Functions.makeHttpRequest({
      url: `https://api-sepolia.basescan.org/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`,
  });

  // Check if the HTTP request was successful
  if (basescanResponse.error) {
      throw new Error(`HTTP request failed: ${basescanResponse.error}`);
  }

  // Check if data and result are defined in the response
  const { result } = basescanResponse.data;
  if (result && result.length > 0) {
      const { SourceCode } = result[0];
      console.log("🚀 ~ basescanResponse:", SourceCode);

      // Determine if the contract is verified
      if (SourceCode && SourceCode.trim() !== '') {
          verified = true; // Update to true if verified
      } else {
          verified = false; // Ensure that it's false for any other status
      }
  } else {
      throw new Error("Invalid response format or contract not found");
  }

} catch (error) {
  console.error("Error during contract verification:", error.message);
}

// Return the encoded string based on the verification status
return Functions.encodeString(
  verified ? "This is a verified contract on Basescan" : "This is NOT a verified contract on Basescan"
);
