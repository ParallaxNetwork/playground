// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../contracts_lib/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

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

interface Unlock {
    function createLock(
        uint256 _expirationDuration,
        address _tokenAddress,
        uint256 _keyPrice,
        uint256 _maxNumberOfKeys,
        string calldata _lockName,
        bytes12
    ) external returns (address);
}

//SUB

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

//-------------

contract PGCore is Ownable {
    event ErrorWithdraw(string _err);
    event InitWithdraw(address idol, uint256 amount);
    event IdolWithdraw(address idol, uint256 amount);

    uint256 private DIVIDER = 1000000;
    uint256 private BASIS_POINT = 9000;
    uint256 public IDOL_COUNT = 0;
    Unlock public unlock;

    constructor(address _unlockAddress) {
        unlock = Unlock(_unlockAddress);
    }

    struct IdolProfile {
        address lockAddress;
        address idolAddress;
        address nftKeyAddress;
        uint256 createdAt;
        uint256 balance;
        string lockName;
        string lockImage;
        string playbackID;
        string streamID;
        string description;
        string[] interest;
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Only EOA");
        _;
    }

    mapping(uint256 => IdolProfile) public idolData;
    mapping(address => uint256) public idolIndex;

    function splitPercentage(uint256 amount) internal view returns (uint256) {
        return (amount * (BASIS_POINT * 100)) / DIVIDER;
    }

    function createIdol(
        uint256 _expirationDuration,
        uint256 _keyPrice,
        uint256 _maxNumberOfKeys,
        uint256 _numberOfImages,
        string calldata _lockName,
        string calldata _lockImage,
        string calldata _baseUri
    ) external returns (address lock) {
        require(_expirationDuration > 0, "invalid duration");
        require(_keyPrice > 0, "invalid price");
        require(_keyPrice > 0, "invalid max number of keys");
        require(bytes(_lockName).length != 0, "invalid lock name");
        require(idolIndex[msg.sender] == 0, "idol data is exist");
        address createdLock = unlock.createLock(
            _expirationDuration,
            address(0),
            _keyPrice,
            _maxNumberOfKeys,
            _lockName,
            ""
        );
        //---
        PublicLock(createdLock).addLockManager(msg.sender);
        //---
        PublicLock(createdLock).setLockMetadata(_lockName, "KEY", _lockImage);
        PublicLock(createdLock).updateLockConfig(
            _expirationDuration,
            _maxNumberOfKeys,
            99999999
        );
        IDOL_COUNT++;
        IdolProfile storage Idols = idolData[IDOL_COUNT];
        Idols.lockAddress = createdLock;
        Idols.nftKeyAddress = address(
            new PGSubs(createdLock, _maxNumberOfKeys, _baseUri, _numberOfImages)
        );
        Idols.idolAddress = msg.sender;
        Idols.createdAt = block.timestamp;
        Idols.lockImage = _lockImage;
        Idols.lockName = _lockName;
        idolIndex[msg.sender] = IDOL_COUNT;
        return createdLock;
    }

    function createNewSubscription(
        uint256 _keyNumbers,
        uint256 _numberOfImages,
        string calldata _baseUri
    ) external {
        uint256 index = idolIndex[msg.sender];
        IdolProfile storage Idols = idolData[index];
        Idols.nftKeyAddress = address(
            new PGSubs(
                Idols.lockAddress,
                _keyNumbers,
                _baseUri,
                _numberOfImages
            )
        );
    }

    function updatePlaybackID(
        string calldata _playbackId,
        string calldata _streamID,
        string calldata _description,
        string[] memory _interest
    ) external onlyEOA {
        uint256 index = idolIndex[msg.sender];
        IdolProfile storage Idols = idolData[index];
        require(Idols.idolAddress == msg.sender, "not owner");
        Idols.playbackID = _playbackId;
        Idols.streamID = _streamID;
        Idols.description = _description;
        Idols.interest = _interest;
    }

    /**
     * @dev Called by subscription owner to init withdraw sales
     */
    function initWithdraw() external onlyEOA {
        uint256 index = idolIndex[msg.sender];
        IdolProfile storage Idols = idolData[index];
        require(Idols.idolAddress == msg.sender, "not owner");
        PublicLock publock = PublicLock(Idols.lockAddress);
        uint256 lockBalance = address(Idols.lockAddress).balance;
        require(lockBalance > 0, "low balance");

        try
            publock.withdraw(address(0), payable(address(this)), 0)
        {} catch Error(string memory _err) {
            emit ErrorWithdraw(_err);
            revert();
        }
        emit InitWithdraw(msg.sender, lockBalance);
        Idols.balance = lockBalance;
    }

    /**
     * @dev Called by owner to withdraw sales
     */
    function withdrawSales() external onlyEOA {
        uint256 index = idolIndex[msg.sender];
        IdolProfile storage Idols = idolData[index];
        require(Idols.idolAddress == msg.sender, "not owner");
        require(Idols.balance > 0, "nothing to withdraw");
        Address.sendValue(payable(msg.sender), splitPercentage(Idols.balance));
        emit IdolWithdraw(msg.sender, Idols.balance);
    }

    /**
     * @dev Called by owner to align unlock protocol contract address
     * @param _newAddress specifies the address of unlock protocol cores.
     */
    function setUnlockAddress(address _newAddress) external onlyOwner {
        unlock = Unlock(_newAddress);
    }

    /**
     * @dev Called by owner to align idol revenue basis points
     * @param _basisPoint specifies the basis point
     */
    function setIdolPercentage(uint256 _basisPoint) external onlyOwner {
        BASIS_POINT = _basisPoint;
    }

    /**
     * @dev Called by owner to withdraw remaining balance
     */
    function withdrawOwner() external onlyOwner {
        Address.sendValue(payable(msg.sender), address(this).balance);
    }

    /**
     * @dev Called to get single idol data
     * @param idols specifies idol address
     */
    function getSingleIdolData(address idols)
        external
        view
        returns (IdolProfile memory profile)
    {
        uint256 index = idolIndex[idols];
        IdolProfile storage Idols = idolData[index];
        return Idols;
    }

    /**
     * @dev Called to get single all available idol data
     * @param start specifies start index of loop
     * @param end specifies end index of loop
     */
    function getAllIdolData(uint256 start, uint256 end)
        public
        view
        returns (IdolProfile[] memory)
    {
        IdolProfile[] memory id = new IdolProfile[](start + end);
        for (uint256 i = start; i <= end; i++) {
            IdolProfile storage member = idolData[i];
            id[i] = member;
        }
        return id;
    }

    /**
     * @dev Called to get users eligibility for subscription
     * @param idolAddress specifies subscription owner address
     */
    function tokenGate(address idolAddress) public view returns (uint256) {
        uint256 index = idolIndex[idolAddress];
        IdolProfile storage Idols = idolData[index];
        return PublicLock(Idols.lockAddress).balanceOf(msg.sender);
    }

    receive() external payable {}
}
