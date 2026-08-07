// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/MeritTypes.sol";

contract MeritBadge is ERC721, Ownable {
    error SoulboundTokenCannotBeTransferred();
    error UnauthorizedProtocol();

    address public meritProtocol;
    uint256 private _nextTokenId = 1;

    struct BadgeData {
        uint256 roleLevel;
        uint256 reputation;
        uint256 mintedAtBlock;
    }

    mapping(uint256 => BadgeData) public badgeData;
    mapping(address => uint256) public userBadgeId;

    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, uint256 roleLevel, uint256 reputation);
    event ProtocolSet(address indexed meritProtocol);

    constructor(address initialOwner) ERC721("Merit Protocol Badge", "MERIT") Ownable(initialOwner) {}

    modifier onlyProtocol() {
        if (msg.sender != meritProtocol && msg.sender != owner()) revert UnauthorizedProtocol();
        _;
    }

    function setMeritProtocol(address _meritProtocol) external onlyOwner {
        require(_meritProtocol != address(0), "Invalid protocol address");
        meritProtocol = _meritProtocol;
        emit ProtocolSet(_meritProtocol);
    }

    function mintBadge(address recipient, uint256 roleLevel, uint256 reputation) external onlyProtocol returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        uint256 existingTokenId = userBadgeId[recipient];
        
        if (existingTokenId > 0) {
            // Update existing badge data
            badgeData[existingTokenId] = BadgeData({
                roleLevel: roleLevel,
                reputation: reputation,
                mintedAtBlock: block.number
            });
            emit BadgeMinted(recipient, existingTokenId, roleLevel, reputation);
            return existingTokenId;
        }

        uint256 tokenId = _nextTokenId++;
        userBadgeId[recipient] = tokenId;
        badgeData[tokenId] = BadgeData({
            roleLevel: roleLevel,
            reputation: reputation,
            mintedAtBlock: block.number
        });

        _safeMint(recipient, tokenId);
        emit BadgeMinted(recipient, tokenId, roleLevel, reputation);
        return tokenId;
    }

    // Override transfer functions to enforce Soulbound property
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) and burning (to == address(0)), block standard transfers
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenCannotBeTransferred();
        }
        return super._update(to, tokenId, auth);
    }
}
