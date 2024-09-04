// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOnChainAI } from "./IOnchainAI.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ScamHunterToken is ERC20, ERC20Burnable, Ownable {
	// Declare instance of Chainlink API Request Contract
	IOnChainAI private onChainAI;

	mapping(address => bool) public analyzedContract;

	event Analyzed(address indexed _contractAddress, string analysis);

	error InsufficiantBalance();

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

	// Internal function to analyze a contract
	function analyzeContract(
		address memory _contractAddress
	) internal nonReentrant {
		// Check if the contract has enough balance to proceed
		if (address(this).balance < 0.002 ether) {
			revert InsufficientBalance();
		}

		string memory userPrompt = addressToString(_contractAddress);

		try onChainAI.sendRequest{ value: 0.002 ether }(userPrompt) returns (
			bytes32 res
		) {
			// Mark the contract as analyzed only after a successful external call
			analyzedContract[contractAddress] = true;

			// Emit an event with the analysis result
			emit Analyzed(contractAddress, res);
		} catch {
			// Handle the error case if the external call fails
			console.log("Analysis failed for contract:", contractAddress);
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
