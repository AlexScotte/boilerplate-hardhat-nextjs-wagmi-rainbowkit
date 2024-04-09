import React, { createContext, useEffect, useState } from "react";
import { GetExpectedChainIdWithEnv } from "@/utils/utils";
import {
    useAccount,
} from "wagmi";
import { useErrorStore } from "@/components/errors/ErrorStore";
import { Contract } from "@/types/contract";

export const ContractContext = createContext<Contract>({} as Contract);

const ContractProvider = ({ children }: { children: React.ReactNode }) => {

    const { inError } = useErrorStore();

    const [contracts, setContracts] = useState<Contract>({ "simpleStorageAbi": "" });

    const expectedChainId = GetExpectedChainIdWithEnv();

    useEffect(() => {
        console.log(`Loading contract provider on chain : ${expectedChainId}`);
        getContractAbi();
    }, [inError]);


    const getContractAbi = async () => {

        let simpleStorageAbi;
        try {
            // Try to get the contract artifact
            const simpleStorageArtifact = require("@/contracts/SimpleStorage.json");
            if (!simpleStorageArtifact.networks[expectedChainId]) {

                const error = `SimpleStorage contract not deployed on chaind id ${expectedChainId}`;
                console.log(error);
                useErrorStore.setState({ inError: true, errorMessage: error });
            }

            simpleStorageAbi = simpleStorageArtifact.abi;
            console.log("SimpleStorage contract loaded");
        }
        catch (error) {
            console.log(error);
        }

        /*************************************
         ** Get abi of other contracts here **
         *************************************/


        setContracts({ simpleStorageAbi });
    };


    return (
        <ContractContext.Provider value={contracts}>
            {children}
        </ContractContext.Provider>
    );
}

export default ContractProvider;