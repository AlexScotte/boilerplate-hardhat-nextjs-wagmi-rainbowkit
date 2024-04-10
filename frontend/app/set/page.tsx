'use client';
import Layout from "@/components/Layout";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract } from "@/types/contract";
import {
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  useToast
} from "@chakra-ui/react";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  type Abi,
} from 'abitype'
const Set = () => {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const { simpleStorageAddress, simpleStorageAbi } = useContext<Contract>(ContractContext);
  const [newValue, setNewValue] = useState<number>(0);

  const {
    data: hash,
    error: setStoredValueError,
    isPending: isStoredValuePending,
    writeContract } = useWriteContract()

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    error: txConfirmationError,
  } = useWaitForTransactionReceipt({ hash })


  /********************
   * Validation/Error management *
   ********************/
  useEffect(() => {

    if (isTxConfirming) {
      toast({
        title: "Waiting for confirmation ...",
        description: `Transaction hash: ${hash}`,
        status: "loading",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      })
    }
  }, [isTxConfirming])

  useEffect(() => {

    if (isTxConfirmed) {
      toast.closeAll();

      toast({
        title: "Transaction confirmed !",
        description: `${hash}`,
        status: "success",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      })
    }
  }, [isTxConfirmed])

  useEffect(() => {

    if (txConfirmationError) {

      toast({
        title: "Transaction error",
        description: `${txConfirmationError.message}`,
        status: "error",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      })
    }

    console.log(txConfirmationError);

  }, [txConfirmationError])

  useEffect(() => {

    if (setStoredValueError) {

      toast({
        title: "Transaction error",
        description: `${setStoredValueError.message}`,
        status: "error",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      })

      console.log(setStoredValueError);

    }
  }, [setStoredValueError])

  /********************* */


  /**
   * Modify the value in the contract
   */
  const setStoredValue = async () => {

    console.log(newValue);

    if (!isConnected) {

      toast({
        title: "Not connected",
        description: "Please connect your wallet",
        status: "warning",
        duration: 5000,
        position: "bottom-right",
        isClosable: true,
      })
    }
    else {

      try {
        const test = await writeContract({
          address: simpleStorageAddress as `0x${string}`,
          abi: simpleStorageAbi as unknown as Abi,
          functionName: 'set',
          account: address,
          args: [newValue]
        });
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Layout>
      <Flex direction={"column"} rowGap={5}>
        <NumberInput
          onChange={(_, valueAsNumber) => setNewValue(valueAsNumber)}
          value={newValue}
          min={0}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Button
          onClick={() => setStoredValue()}
          isLoading={isStoredValuePending}>
          Set
        </Button>
      </Flex>
    </Layout>
  );
}

export default Set;