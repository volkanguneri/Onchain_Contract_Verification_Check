// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOnChainAI } from "./interfaces/IOnchainAI.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ScamHunterToken
 * @dev ERC20 token with burnable, ownable, and reentrancy guard features. Integrated with OnChainAI for contract verification.
 */
contract ScamHunterToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
	/// @dev Chainlink-based contract for AI-driven verification requests
	IOnChainAI private onChainAI;

	/// @dev Mapping to track whether a contract has been verified or not
	mapping(address => bool) public isContractVerified;

	/// @notice Emitted when a contract has been verified successfully
	/// @param contractAddress The address of the contract that was verified
	/// @param verificationResult The result of the contract verification
	event ContractVerified(address indexed contractAddress,bytes32 verificationResult);

	/// @notice Emitted when a request to verify a contract is sent
	/// @param contractAddress The address of the contract to be verified
	/// @param isSent Boolean indicating if the request was successfully sent
	event VerificationRequestSent(address contractAddress, bool isSent);

	/// @notice Emitted when a verification request fails
	/// @param contractAddress The address of the contract for which the request failed
	/// @param errorMessage Error message describing why the request failed
	event VerificationRequestFailed(address contractAddress,string errorMessage);

	/// @dev Custom error when the contract balance is insufficient for verification requests
	error InsufficientContractBalance();

	/// @dev Custom error when a contract is attempted to be used before verification
	error ContractNotVerified();

	/**
	 * @notice Constructor to deploy the ScamHunterToken contract
	 * @param onChainAIAddress The address of the OnChainAI contract for performing contract verification
	 */
	constructor(address onChainAIAddress) payable ERC20("Scam Hunter Token", "SHT") Ownable() {
		_mint(msg.sender, 1_000_000 * (10 ** 18));
		onChainAI = IOnChainAI(onChainAIAddress);
	}

	/**
	 * @notice Approves an allowance for a spender, only if the contract has been verified
	 * @param spender The address to which tokens are allowed to be spent
	 * @param amount The number of tokens to approve for spending
	 * @return A boolean indicating success or failure
	 */
	function approve(address spender,uint256 amount) public override returns (bool) {
		if (!isContractVerified[spender]) {
			revert ContractNotVerified();
		}
		return super.approve(spender, amount);
	}

	/**
	 * @notice Verifies a given smart contract using OnChainAI
	 * @param contractAddress The address of the contract to verify
	 */
	function verifyContract(address contractAddress) public nonReentrant {
		if (address(this).balance < 0.002 ether) {
			revert InsufficientContractBalance();
		}
		isContractVerified[contractAddress] = true;
		string memory contractAddressString = addressToString(contractAddress);
		try onChainAI.sendRequest{ value: 0.002 ether }(contractAddressString) {
			emit VerificationRequestSent(contractAddress, true);
			console.log("Request Sent: ", contractAddress);
		} catch Error(string memory reason) {
			isContractVerified[contractAddress] = false;
			emit VerificationRequestFailed(contractAddress, reason);
		}
	}

	/**
	 * @notice Converts an address to its string representation in hexadecimal format
	 * @param addr The address to convert
	 * @return The string representation of the address
	 */
	function addressToString(address addr) internal pure returns (string memory) {
		bytes32 value = bytes32(uint256(uint160(addr)));
		bytes memory alphabet = "0123456789abcdef";
		bytes memory str = new bytes(42);
		str[0] = "0";
		str[1] = "x";
		for (uint256 i = 0; i < 20; i++) {
			str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
			str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
		}
		return string(str);
	}

	/**
	 * @notice Allows the contract owner to withdraw the contract's Ether balance
	 * @param receiver The address to send the Ether to
	 */
	function withdraw(address receiver) external onlyOwner {
		(bool success, ) = payable(receiver).call{
			value: address(this).balance
		}("");
		require(success, "Withdraw failed");
	}

	/**
	 * @dev Fallback function to receive Ether
	 */
	receive() external payable {}
}
