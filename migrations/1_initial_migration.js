//PGCORE = DEPLOY UNLOCK
const Migrations = artifacts.require("PGCore");
//PGSUB = DEPLOY LOCK WITH NFT
//const Migrations = artifacts.require("PGSubs");

module.exports = function (deployer) {
  //unlock mumbai 0x1FF7e338d5E582138C46044dc238543Ce555C963
  //unlock mainnet 0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f
  //DEPLOY UNLOCK

   deployer.deploy(Migrations, '0x1FF7e338d5E582138C46044dc238543Ce555C963');

  //DEPLOY LOCK
  //LOCK ADDRESS + MAX SUPPLY + METADATA URL + NEW / ADD DURATION 
  //deployer.deploy(Migrations, '0x07447A3Ef0045834380C9eb44615d709020ab0f8', 20, "ipfs://QmQUnp86owydqdrW6sHtwGb26Uj161t2jJQ7B6DtfUy2ZE/", 86400);
};
