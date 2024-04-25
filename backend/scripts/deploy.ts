import { ethers } from 'hardhat';
import hre from 'hardhat';
import type {
    BaseContract,
} from "ethers";

const contractFrontFolder = "../../frontend/contracts";
const artifactsFolder = "../artifacts/contracts";


// Types
import { SimpleStorage } from '../typechain-types';

async function main() {

    let contract: SimpleStorage;
    const contractName= "SimpleStorage";

    try {

        console.log(`⛓️  Deploying contract to network: ${hre.network.name}`)

        const [owner] = await ethers.getSigners();

        console.log(`👤 Owner address: ${owner.address}`)
        console.log(`📝 Deploying contract: ${contractName}...`)
        contract = await ethers.deployContract(contractName, [owner.address]);
        await contract.waitForDeployment();

        console.log(
            `✅ ${contractName} deployed to: ${contract.target} by: ${owner.address} on network: ${hre.network.name} with chainId: ${hre.network.config.chainId}`
        )
    }
    catch (error) {
        throw new Error(`❌ Error when deploying contract: ${error}`);
    }

    await saveFrontendFiles(contractName, contract);
}

async function saveFrontendFiles(contractName: string, contract: BaseContract) {
    const fs = require("fs");
    const path = require("path");

    const frontContractsDir = path.join(__dirname, contractFrontFolder);
    const frontContractFilePath = path.join(frontContractsDir, `${contractName}.json`);

    console.log(`📁 Frontend contract directory: ${frontContractsDir}`);
    if (!fs.existsSync(frontContractsDir)) {
        fs.mkdirSync(frontContractsDir);
    }

    const backArtifactsDir = path.join(__dirname, artifactsFolder);
    const backContractArtifactPath = path.join(backArtifactsDir, `${contractName}.sol/${contractName}.json`);

    console.log(`📁 Backend contract artifact path: ${backContractArtifactPath}`);


    const networkName = hre.network.name
    const chainId = hre.network.config.chainId ?? "";
    if (!chainId)
        throw new Error("❌ Chain ID not found in hardhat.config.ts file. Please add chainId to the network configuration.");

    let previousArtifact: any;
    let currentArtifact: any;
    let abiChanged: boolean = false;

    try {
        // Read current artifact
        currentArtifact = JSON.parse(
            fs.readFileSync(backContractArtifactPath, "utf8")
        );
    } catch (err) {
        throw new Error("❌ Error when reading artifact, verify that you build the contract first and check the contract artifact path");
    }

    try {
        // Read previous deployed artifact
        previousArtifact = JSON.parse(
            fs.readFileSync(frontContractFilePath, "utf8")
        );

        // If the contract changed, we remove all previous network informations
        if (JSON.stringify(currentArtifact.abi) != JSON.stringify(previousArtifact.abi)) {
            abiChanged = true;
            console.log("🔄 ABI changed, you need to redeploy the contract on all networks");
        }


    } catch (err) {
        console.error("❌ No previous artifact");
        previousArtifact = currentArtifact;
        // previousArtifact = { networks: {} };
    }

    // Write deployed contract informations in a file
    console.log(`🖍️ Write deployed ${contractName} informations in a ${frontContractFilePath}`);
    if (abiChanged || !previousArtifact.hasOwnProperty("networks")) {
        previousArtifact.networks = {};
    }

    // Create chain ID node in networks section
    if (!previousArtifact.networks.hasOwnProperty(chainId)) {
        previousArtifact.networks[chainId] = {};
    }

    previousArtifact.networks[chainId].address = contract.target;
    previousArtifact.networks[chainId].network = networkName;
    const deployTransaction = contract.deploymentTransaction();
    if (deployTransaction) {
        previousArtifact.networks[chainId].transactionHash =
            deployTransaction.hash;
        previousArtifact.networks[chainId].blockNumber =
            deployTransaction.blockNumber;
    }

    currentArtifact.networks = previousArtifact.networks;

    fs.writeFileSync(
        frontContractFilePath,
        JSON.stringify(currentArtifact, null, 2)
    );
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});