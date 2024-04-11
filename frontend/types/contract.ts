
export type Contract = {
    simpleStorageDeployedBlockNumber: number;
    simpleStorageAddress: string;
    simpleStorageAbi: string;

    // TODO: Add other contracts props here
};

export type ValueChangedEventType = {
    txHash: string | undefined,
    oldValue: string,
    newValue: string,
    from: string,
}