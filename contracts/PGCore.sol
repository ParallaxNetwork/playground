// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface PublicLock {
    function withdraw(
        address _tokenAddress,
        address payable _recipient,
        uint256 _amount
    ) external returns (bool);

    function updateLockConfig(
        uint256 _newExpirationDuration,
        uint256 _maxNumberOfKeys,
        uint256 _maxKeysPerAcccount
    ) external;
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

contract PGCore is Ownable {
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
        uint256 createdAt;
        string lockName;
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
        string calldata _lockName
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
        IDOL_COUNT++;
        IdolProfile storage Idols = idolData[IDOL_COUNT];
        Idols.lockAddress = createdLock;
        Idols.idolAddress = msg.sender;
        Idols.createdAt = block.timestamp;
        Idols.lockName = _lockName;
        idolIndex[msg.sender] = IDOL_COUNT;
        return createdLock;
    }

    /**
     * @dev Called by idol to withdraw sales
     */
    function withdrawSales() external onlyEOA {
        uint256 index = idolIndex[msg.sender];
        IdolProfile storage Idols = idolData[index];
        require(Idols.idolAddress == msg.sender, "not owner");
        PublicLock publock = PublicLock(Idols.lockAddress);
        uint256 lockBalance = address(Idols.lockAddress).balance;
        require(lockBalance > 0, "low balance");
        require(
            publock.withdraw(address(0), payable(address(this)), 0) == true,
            "tx failed"
        );
        require(address(this).balance > 0, "no balance");

        Address.sendValue(payable(msg.sender), splitPercentage(lockBalance));
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
     */
    function getAllIdolData() public view returns (IdolProfile[] memory) {
        IdolProfile[] memory id = new IdolProfile[](IDOL_COUNT);
        for (uint256 i = 1; i <= IDOL_COUNT; i++) {
            IdolProfile storage member = idolData[i];
            id[i] = member;
        }
        return id;
    }

    receive() external payable {}
}
