import { mainnet, localhost, sepolia, polygonMumbai } from "viem/chains";

export const ChainID = {
    Local: 1337,
    HardhatLocal: 31337,
    Sepolia: 11155111,
    Mumbai: 80001,
};

/**
 * Get the expected chain id in function of the current environment
 * @returns The expected chain id in function of the current environment
 */
export const GetExpectedChainIdWithEnv = () => {
    if (process.env.NODE_ENV === "development") {
        return [ChainID.Sepolia, sepolia];
    } else {
        return [ChainID.HardhatLocal, localhost];
    }
};

/**
 * 
 * @param address 
 * @returns 
 */
export const ToShortAddress = (address: string) => {
    return address.substring(0, 5) + "..." + address.substring(address.length - 4);
};
