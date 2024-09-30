// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { IBasescanCheck } from "./interfaces/IBasescanCheck.sol";

/**
 * @title ScamHunterToken
 * @dev ERC20 token with burnable, ownable, and reentrancy guard features.
 * Integrated with BasescanCheck for contract verification check.
 */
contract ScamHunterToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    /// @dev Chainlink-based contract for AI-driven verification requests
    IBasescanCheck private basescanCheck;

    /////////////////////////////////////// MAPPING ///////////////////////////////////////////////

    /// @dev Mapping to track whether a contract verification has been checked or not
    mapping(address => bool) public isContractChecked;

    /////////////////////////////////////// EVENTS ////////////////////////////////////////////////

    /// @notice Emitted when a request to check a contract verification is sent
    /// @param contractAddress The address of the contract to be checked
    event CheckRequestSent(address contractAddress);

    /////////////////////////////////// CUSTOM ERRORS /////////////////////////////////////////////

    /// @dev Custom error when the contract balance is insufficient for verification requests
    error InsufficientPayment();

    /// @dev Custom error when a contract is attempted to be used before verification
    error VerificationNotChecked();

    ////////////////////////////////////// CONSTRUCTOR /////////////////////////////////////////////

    /**
     * @notice Constructor to deploy the ScamHunterToken contract.
     * @dev The constructor initializes the ERC20 token with the name "Scam Hunter Token" and symbol "SHT".
     * It also sets the deployer as the owner of the contract by calling the Ownable constructor, and initializes the 
     * BasescanCheck contract address for performing contract verification checks.
     * 
     * @param basescanCheckAddress The address of the BasescanCheck contract used for verification requests.
     */
    constructor(address basescanCheckAddress) ERC20("Scam Hunter Token", "SHT") Ownable() {
        // Mint 1,000,000 tokens to the deployer
        _mint(msg.sender, 1_000_000 * (10 ** 18));  
        basescanCheck = IBasescanCheck(basescanCheckAddress);
    }

    ///////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////

    /**
     * @notice Approves an allowance for a spender, only if the contract verification is checked. 
     * After verification check, it's up to the user to approve even though the contract is not a verified on Basescan.
     * @param spender The address to which tokens are allowed to be spent
     * @param amount The number of tokens to approve for spending
     * @return bool indicating success or failure
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        require(isContractChecked[spender], VerificationNotChecked());
        return super.approve(spender, amount);
    }

    /**
     * @notice Verifies a contract by sending a request to the basescanCheck service.
     * @dev This function uses 0.002 ether to initiate the verification check request and marks the contract as checked.
     * It is protected from reentrancy attacks using the `nonReentrant` modifier.
     * @param contractAddress The address of the contract to verify.
     */
    function checkVerification(address contractAddress) external payable nonReentrant {
        // Ensures the caller sent enough funds
        require(msg.value >= 0.002 ether, InsufficientPayment());
        // Convert the contract address to a string
        string memory contractAddressString = addressToString(contractAddress);  
        // Handle the check request by sending the request to the basescanCheck service
        _handleCheckRequest(contractAddress, contractAddressString);   
    }

    /**
     * @notice Sends a request to the basescanCheck service to verify a contract.
     * @dev This internal function performs the actual request to the basescanCheck service and marks the contract as checked.
     * @param _contractAddress The address of the contract being checked.
     * @param _contractAddressString The string representation of the contract address as sendRequest function parameter is a string.
     */
    function _handleCheckRequest(address _contractAddress, string memory _contractAddressString) internal {
        // Send the request with 0.002 ether
        basescanCheck.sendRequest{ value: 0.002 ether }(_contractAddressString);
			// Mark the contract address as checked
        isContractChecked[_contractAddress] = true;
        // Emit an event to signal the check request
        emit CheckRequestSent(_contractAddress);             
    }

    /**
     * @notice Converts an address to its string representation in hexadecimal format 
     * to be passed in sendRequest function on BasescanCheck contract which requires
     * a string.   
     * @param addr The address to convert
     * @return string representation of the address
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
        (bool success, ) = payable(receiver).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @dev Fallback function to receive Ether
     */
    receive() external payable {}
}
