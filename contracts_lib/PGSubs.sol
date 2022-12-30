// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../contracts_lib/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IPublicLock {
    function balanceOf(address _owner) external view returns (uint256 balance);

    function purchase(
        uint256[] calldata _values,
        address[] calldata _recipients,
        address[] calldata _referrers,
        address[] calldata _keyManagers,
        bytes[] calldata _data
    ) external payable returns (uint256[] memory tokenIds);

    function ownerOf(uint256 tokenId) external view returns (address _owner);

    function keyPrice() external view returns (uint256);
}

contract PGSubs is ERC721A {
    uint256 public maxSupply = 3456;
    uint256 randNonce = 938472992419148174;

    string private baseUri =
        "ipfs://QmQUnp86owydqdrW6sHtwGb26Uj161t2jJQ7B6DtfUy2ZE/";

    IPublicLock public lock;

    mapping(uint256 => uint256) private realTokenId;

    constructor(
        address _lockAddress,
        uint256 _maxSupply,
        string memory _baseUri
    ) ERC721A("Playground Subscription", "PGS") {
        lock = IPublicLock(_lockAddress);
        maxSupply = _maxSupply;
        baseUri = _baseUri;
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Only EOA");
        _;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return
            bytes(baseUri).length != 0
                ? string(
                    abi.encodePacked(
                        baseUri,
                        Strings.toString(realTokenId[tokenId])
                    )
                )
                : "";
    }

    function purchaseSub() external payable onlyEOA {
        uint256 price = lock.keyPrice();
        require(msg.value >= price, "value is underprice");
        address[] memory t = new address[](1);
        bytes[] memory k = new bytes[](0);
        uint256[] memory v = new uint256[](1);
        t[0] = msg.sender;
        v[0] = price;
        lock.purchase(v, t, t, t, k);
        require(totalSupply() + 1 <= maxSupply, "Max Supply reached");
        _safeMint(msg.sender, 1);
        realTokenId[totalSupply()] = rand();
    }

    function numberminted(address owner) public view returns (uint256) {
        return _numberMinted(owner);
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    function rand() public view returns (uint256) {
        return
            (uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % maxSupply) + 1;
    }
}
