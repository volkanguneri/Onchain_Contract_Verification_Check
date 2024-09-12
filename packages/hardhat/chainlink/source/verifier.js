if (!secrets.etherscanAPIKey) throw Error("Need Etherscan_API_Key environment variable");

// Gets the contract address temporarily defined in request-config.js.
const contractAddress = args[0];


// HTTP request to get the contract if verified on Etherscan.
const etherscanResponse = await Functions.makeHttpRequest({ 
    url: `https://api-sepolia.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${secrets.etherscanAPIKey}`,
})

console.log(`etherscanResponse: ${etherscanResponse}`)

// Check if the HTTP request was successful
if (etherscanResponse.error) {
    throw new Error(`HTTP request failed: ${etherscanResponse.error}`);
}

// Check if data and result are defined in the response
if (!etherscanResponse.data || !etherscanResponse.data.result || etherscanResponse.data.result.length === 0) {
  throw new Error('Invalid response from Etherscan API or contract not found.');
}

// Retrieve the content of the response
const sourceCodeJson = etherscanResponse.data.result[0].SourceCode;

// Parsing the JSON if necessary
let parsedSourceCode;
try {
    // Remove double curly braces if present and parse the JSON
    parsedSourceCode = JSON.parse(sourceCodeJson.replace(/{{/g, '{').replace(/}}/g, '}'));
} catch (error) {
    console.error("Error parsing the source code JSON:", error);
}

// Declare variable to store the combined content of all contract files
let contractContent = "";

// Vérifiez si la source du code est présente et extrayez le premier fichier si possible
if (parsedSourceCode && parsedSourceCode.sources) {
  // Obtenez les clés de tous les fichiers disponibles dans l'objet sources
  const fileKeys = Object.keys(parsedSourceCode.sources);
  
  // Vérifiez s'il y a au moins un fichier dans la liste
  if (fileKeys.length > 0) {
    // Obtenez la première clé (nom du fichier)
    const firstFileKey = fileKeys[0];
    
    // Vérifiez si le contenu du fichier est défini et non vide
    if (parsedSourceCode.sources[firstFileKey] && parsedSourceCode.sources[firstFileKey].content) {
      // Extraire le contenu du premier fichier
      const firstFileContent = parsedSourceCode.sources[firstFileKey].content;
      
      // Assigner le contenu à la variable contractContent
      contractContent = firstFileContent;
    } else {
      throw new Error(`Le contenu du fichier ${firstFileKey} est manquant ou vide.`);
    }
  } else {
    throw new Error('Aucun fichier trouvé dans l\'objet sources.');
  }
} else {
  throw new Error('L\'objet sources est absent ou mal formaté.');
}

if (!contractContent) {
    throw new Error('Le contenu du contrat est vide. Impossible de poursuivre.');
}

console.log("🚀 ~ contractContent:", contractContent)

return Functions.encodeString("Failed to fetch etherscan request response");


// // [3] PROMPT ENGINEERING //
// const prompt = `Analyse the smart contract, tell in one sentence there is an important security issue to interact with: ${contractContent}`;

// // [4] I DATA REQUEST //
// let openAIRequest;
// try {
//   // Ensure the API key is available
//   if (!secrets.openaiAPIKey) {
//     throw new Error("OpenAI API key is missing. Please ensure it is set correctly.");
//   }

//   // Make the OpenAI API request
//   openAIRequest = await Functions.makeHttpRequest({
//     url: `https://api.openai.com/v1/chat/completions`,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${secrets.openaiAPIKey}`,
//     },
//     data: {
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are a smart contract auditor",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     },
//     timeout: 10000,
//     responseType: "json",
//   });
//   console.log(" ~ openAIRequest:", openAIRequest)

//   // Log the entire response for debugging purposes
// //   console.log(`OpenAI API response: ${JSON.stringify(openAIRequest.data, null, 2)}`);

//   // Check if the data is present and in the expected format
//   if (!openAIRequest.data || !openAIRequest.data.choices || openAIRequest.data.choices.length === 0) {
//     throw new Error("Invalid response from OpenAI API: 'choices' array is missing or empty.");
//   }

//   // Extract the result from the response
//   const stringResult = openAIRequest.data.choices[0].message.content.trim();
//   const result = stringResult.toString();

//   console.log(`OpenAI security analysis of the contract address ${contractAddress} is: ${result}`);
//   return Functions.encodeString(result || "Failed");

// } catch (error) {
//   console.error("Error during the OpenAI request process:", error);
//   return Functions.encodeString("Failed to fetch openAi request response");
// }