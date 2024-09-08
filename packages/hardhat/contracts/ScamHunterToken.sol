// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOnChainAI } from "./IOnchainAI.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ScamHunterToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
	// Declare instance of Chainlink API Request Contract
	IOnChainAI private onChainAI;

	mapping(address => bool) public analyzedContract;

	event Analyzed(address indexed _contractAddress, bytes32 analysis);
	event RequestSended(address _contractAddresse, bool sended);
	event RequestFailed(address _contractAddress, string error);

	error InsufficientContractBalance();
	error ContractNotAnalyzedYet();

	// error ContractNotAnalyzed();

	constructor(
		address onChainAI_address
	) payable ERC20("Scam Hunter Token", "SHT") Ownable() {
		_mint(msg.sender, 1000000 * (10 ** 18));
		// Initialise Chainlink API Request contract
		onChainAI = IOnChainAI(onChainAI_address);
	}

	function approve(
		address spender,
		uint256 amount
	) public override returns (bool) {
		// if (analyzedContracts[spender] = false) {
		// 	revert ContractNotAnalyzed();
		// }
		analyzeContract(spender);
		return super.approve(spender, amount);
	}

	function analyzeContract(address _contractAddress) public nonReentrant {
		// Check if the contract has enough balance to proceed
		if (address(this).balance < 0.002 ether) {
			revert InsufficientContractBalance();
		}
		// Check if the contract has already been analyzed
		if (analyzedContract[_contractAddress] = false) {
			revert ContractNotAnalyzedYet();
		}
		analyzedContract[_contractAddress] = true;
		string memory userPrompt = addressToString(_contractAddress);
		try onChainAI.sendRequest{ value: 0.002 ether }(userPrompt) returns (
			bytes32
		) {
			// Emitting an event to log that the request has been sent successfully
			emit RequestSended(_contractAddress, true);
			// Optionally: Store the requestId to check it later if needed
		} catch Error(string memory reason) {
			// Catching and logging the reason of the failure in case of a failed transaction
			emit RequestFailed(_contractAddress, reason);
			analyzedContract[_contractAddress] = false;
		}
	}

	// Helper function to convert an address to a string
	function addressToString(
		address _addr
	) internal pure returns (string memory) {
		bytes32 value = bytes32(uint256(uint160(_addr)));
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

	// Withdraw function
	function withdraw(address receiver) external onlyOwner {
		(bool success, ) = payable(receiver).call{
			value: address(this).balance
		}("");
		require(success, "Withdraw failed");
	}

	// Function to receive Ether
	receive() external payable {}
}
