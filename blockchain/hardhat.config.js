require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 31337,
    },
  },
  solidity: "0.8.19",
};