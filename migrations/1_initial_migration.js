const Migrations = artifacts.require("PGSubs");

module.exports = function (deployer) {
  let params = ['']
  deployer.deploy(Migrations, params.join());
};
