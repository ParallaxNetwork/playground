// SPDX-License-Identifier: MIT
import "../contracts_lib/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
pragma solidity ^0.8.17;

interface PublicLock {
    function withdraw(
        address _tokenAddress,
        address payable _recipient,
        uint256 _amount
    ) external;

    function updateLockConfig(
        uint256 _newExpirationDuration,
        uint256 _maxNumberOfKeys,
        uint256 _maxKeysPerAcccount
    ) external;

    function setLockMetadata(
        string calldata _lockName,
        string calldata _lockSymbol,
        string calldata _baseTokenURI
    ) external;

    function addLockManager(address account) external;

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
    event ERRINTERACTION(string msg);
    event CALLDATA(
        uint256[] val,
        address[] recipient,
        address[] referrer,
        address[] keyManager,
        bytes[] data
    );

    uint256 public maxSupply = 3456;
    uint256 randNonce = 938472992419148174;
    string private baseUri =
        "ipfs://QmQUnp86owydqdrW6sHtwGb26Uj161t2jJQ7B6DtfUy2ZE/";
    uint256 public numberOfImages = 0;
    PublicLock public lock;

    mapping(uint256 => uint256) private realTokenId;

    constructor(
        address _lockAddress,
        uint256 _maxSupply,
        string memory _baseUri,
        uint256 _numberOfImages
    ) ERC721A("Playground Subscription", "PGS") {
        lock = PublicLock(_lockAddress);
        maxSupply = _maxSupply;
        baseUri = _baseUri;
        numberOfImages = _numberOfImages;
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
        require(msg.value >= lock.keyPrice(), "value is underprice");
        address[] memory recipient = new address[](1);
        address[] memory referrer = new address[](1);
        address[] memory keyManager = new address[](1);
        bytes[] memory data = new bytes[](1);
        uint256[] memory val = new uint256[](1);
        recipient[0] = msg.sender;
        referrer[0] = address(0);
        keyManager[0] = address(0);
        data[0] = "";
        val[0] = msg.value;
        emit CALLDATA(val, recipient, referrer, keyManager, data);
        try
            lock.purchase{value: msg.value}(
                val,
                recipient,
                referrer,
                keyManager,
                data
            )
        {} catch Error(string memory _err) {
            emit ERRINTERACTION(_err);
            revert();
        }
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
            ) % numberOfImages) + 1;
    }
}
