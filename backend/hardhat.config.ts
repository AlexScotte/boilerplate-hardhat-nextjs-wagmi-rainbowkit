import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ACCOUNT_MNEMONIC = process.env.ACCOUNT_MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ALCHEMY_SEPOLIA_KEY = process.env.ALCHEMY_SEPOLIA_KEY || "";
const ALCHEMY_MUMBAI_KEY = process.env.ALCHEMY_MUMBAI_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  defaultNetwork: "localhost",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      // accounts: {
      //   mnemonic: ACCOUNT_MNEMONIC,
      // },
      chainId: 11155111,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      // accounts: {
      //   mnemonic: ACCOUNT_MNEMONIC,
      // },
      chainId: 80001,
      gasPrice: 80000000000,
    },
  },
};

export default config;
