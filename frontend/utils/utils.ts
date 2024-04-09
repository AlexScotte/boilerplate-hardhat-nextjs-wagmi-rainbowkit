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
    if (process.env.NODE_ENV === "production") {
        return ChainID.Sepolia;
    } else {
        return ChainID.HardhatLocal;
    }
};
