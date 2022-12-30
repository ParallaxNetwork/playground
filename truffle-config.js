const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
const fs = require("fs");

// const mnemonic = fs.readFileSync(".secret").toString().trim();
// const PrivateKeyProvider = require("truffle-privatekey-provider");


module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: process.env.BSC_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    arbiscan: process.env.ETHERSCAN_API_KEY,
    goerli_etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.POLYGON_API_KEY,
    testnet_polygonscan: process.env.POLYGON_API_KEY
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      defaultEtherBalance: 500,
      websockets: true,
    },
    bsc_testnet: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://bsc.getblock.io/testnet/?api_key=d96b4bfd-76c6-41f4-825c-626844213e20`
        ),
      network_id: 97,
      confirmations: 3,
      timeoutBlocks: 1300,
      skipDryRun: true,
      // gas: 6721975, //from ganache-cli output
      // gasPrice: 20000000000, //From ganache-cli output
      // gas: 2600000,
      // timeoutBlocks: 50000,
      //networkCheckTimeout: 1000000
    },
    bsc: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          `https://bsc-dataseed1.defibit.io`
        ),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
    eth_testnet: {
      // provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
      provider: () =>
        new HDWalletProvider(
          privateKey,
          "https://rpc.ankr.com/eth_goerli"
        ),
      network_id: 5,
      // network_id: 3,
      confirmations: 2,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
    mumbai: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          "https://rpc.ankr.com/polygon_mumbai"
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
    polygon: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          "https://polygon-rpc.com/"
        ),
      network_id: 137,
      confirmations: 4,
      timeoutBlocks: 300,
      skipDryRun: true,
    },
    eth: {
      // provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
      provider: () =>
        new HDWalletProvider(
          privateKey,
          "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        ),
      network_id: 1,
      confirmations: 10,
      timeoutBlocks: 300,
      skipDryRun: true,
      gas: 2926328,
      gasPrice: 32000000000,
    },
  },


  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.17",
      settings: {

        optimizer: {
          enabled: true,
          runs: 200,
        },
        // evmVersion: "byzantium"
      },
    },
  },


  db: {
    enabled: false,
  },
};
