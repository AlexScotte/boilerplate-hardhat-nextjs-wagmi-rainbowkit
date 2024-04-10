import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_ID = process.env.INFURA_ID || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  defaultNetwork: "localhost",
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      // accounts: [`0x${PRIVATE_KEY}`],
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 5,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`,
      },
      chainId: 80001,
      gasPrice: 80000000000,
    },
  },
};

export default config;
