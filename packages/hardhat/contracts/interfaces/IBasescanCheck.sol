// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface IBasescanCheck {
	// Getter functions ((public variables)
	function javascript() external view returns (string memory);

	function lastRequestId() external view returns (bytes32);

	function lastResponse() external view returns (string memory);

	function lastError() external view returns (string memory);

	function lastUserPrompt() external view returns (string memory);

	function subscriptionId() external view returns (uint64);

	function gasLimit() external view returns (uint32);

	function donId() external view returns (bytes32);

	function donHostedSecretsVersion() external view returns (uint64);

	// Function to send request
	function sendRequest(
		string memory userPrompt
	) external payable returns (bytes32);

	// Events
	event Javascript(string javascript);
	event Request(bytes32 indexed requestId, string request);
	event Response(bytes32 indexed requestId, string response, string err);

	// Errors
	error UnexpectedRequestID(bytes32 requestId);
}
