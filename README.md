<img width="1132" alt="banner-marketplace" src="https://github.com/AlexScotte/NG-Marketplace/assets/53000621/d4da6856-a391-46d7-b818-302da1dce98e">

<details>
<summary><h1>Back-end</h1></summary>

## Description
  The smart contract is just a simple smart contract for storing and reading a digital value. It generates an event when the value is changed.

All commands must be executed in the backend folder (`cd backend`).

## Configuration

First you need to create a .env file in the root folder of the backend. The file must have these properties:
```
PRIVATE_KEY="8[...]b" // Private key for deploying contract on mainnet or testnet (without "0x" prefix)
# or use seed phrase
#ACCOUNT_MNEMONIC=""
 
ETHERSCAN_API_KEY="D[...]V" // To verify you contract on etherscan after deployment
ALCHEMY_SEPOLIA_KEY="Q[...]O" // To deploy on Sepolia testnet
```
And if necessary modify the hardhat.config.ts if you want to use a specific RPC or use the seed phrase.
```ts
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
     localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      // blockGasLimit: 999999999999999, // Use to increase the block gas limit when testing with coverage
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      // accounts: {
      //   mnemonic: ACCOUNT_MNEMONIC,
      // },
      chainId: 11155111,
    },
  },
```

## Deploying onchain
 * To deploy the local node, simply run you node with the command `npx hardhat node` and execute the command `npx hardhat run ./scripts/deploy.ts --network localhost`. Hardhat will use the first prefunding account to deploy the contract onchain.
 * To deploy on sepolia testnet, don't forget to configure the .env file and execute the command `npx hardhat run ./scripts/deploy.ts --network sepolia`. Hardhat will use the private key indicated in the .env file to deploy the contract onchain (don't forget to have faucet tokens in the wallet). 

<img width="907" alt="image" src="https://github.com/AlexScotte/boilerplate-hardhat-nextjs-wagmi-rainbowkit/assets/53000621/56e7c15b-cafd-418c-8e0b-f391021e6048">

After deploying the script will copy the ABI of the contract (generated at compilation and saved in the artifacts folder) into a folder in the front directory (editable in the script)
This makes it easy to modify and redeploy your contract and test it without importing the ABI.

![image](https://github.com/AlexScotte/boilerplate-hardhat-nextjs-wagmi-rainbowkit/assets/53000621/af11389b-4343-4058-be52-b9ab85be9c7e)


## Testing contract (optional)

Launch the coverage command `npx hardhat coverage` to build and test the contract.
Do not hesitate to uncomment the instruction in hardhat.config.ts to increase the gas limit before running the tests with coverage.

![image](https://github.com/AlexScotte/boilerplate-hardhat-nextjs-wagmi-rainbowkit/assets/53000621/75b7ab1b-b0c5-4bdd-bd9a-bb0130bf186d)

</details>

<details>
<summary><h1>Front-end</h1></summary>
## Deployment
  5. Bar
     * Baz
     * Qux
     * 
</details>
