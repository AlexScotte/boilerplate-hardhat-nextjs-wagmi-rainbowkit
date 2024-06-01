import { Log } from "viem";

export type Contract = {
    simpleStorageDeployedBlockNumber: number;
    simpleStorageAddress: string;
    simpleStorageAbi: string;

    // TODO: Add other contracts props here
};

export type ValueChangedEventType = {
    txHash: string | undefined,
    oldValue: bigint | undefined;
    newValue: bigint | undefined;
    from: string,
}

export interface LogWithArgs extends Log {
    args: {
        oldValue: bigint | undefined;
        newValue: bigint | undefined;
        who: string;
    };
}