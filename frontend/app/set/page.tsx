'use client';
import Layout from "@/components/Layout";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract, ValueChangedEventType } from "@/types/contract";
import {
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  List,
  ListItem,
  useToast
} from "@chakra-ui/react";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,

} from "wagmi";
import {
  type Abi,
} from 'abitype'

import { createPublicClient, http, Log, parseAbiItem, Chain } from "viem";
import { GetExpectedChainIdWithEnv } from "@/utils/utils";

const Set = () => {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const { simpleStorageDeployedBlockNumber, simpleStorageAddress, simpleStorageAbi } = useContext<Contract>(ContractContext);
  const [newValue, setNewValue] = useState<number>(0);
  const [valueChangedEventList, setValueChangedEventList] = useState<ValueChangedEventType[]>([]);
  const [expectedChainId, expectedChainViem] = GetExpectedChainIdWithEnv();


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
   * Event management *
   ********************/


  /**
   * Get the history of the valueChanged event
   */
  useEffect(() => {
    const getEventHistory = async () => {
      const publicClient = createPublicClient({
        chain: expectedChainViem as Chain,
        transport: http()
      })

      const logss = await publicClient.getLogs({
        address: simpleStorageAddress as `0x${string}`,
        event: parseAbiItem('event valueChanged(uint256 oldValue, uint256 newValue, address who)'),
        fromBlock: BigInt(simpleStorageDeployedBlockNumber),
      });

      let oldEventList: ValueChangedEventType[] = [];
      logss.forEach(log => {
        const valueChangedEvent = createEvent(log);
        oldEventList.push(valueChangedEvent);
      });

      setValueChangedEventList(oldEventList.reverse());
    };

    if (simpleStorageAddress) {
      getEventHistory();
    }

  }, [simpleStorageAddress]);

  /**
   * Manage the valueChanged event of the contract
   */
  useWatchContractEvent({
    address: simpleStorageAddress as `0x${string}`,
    abi: simpleStorageAbi as unknown as Abi,
    eventName: 'valueChanged',
    onLogs(logs: Log[]) {
      manageValueChangedEvent(logs[0]);
    }
  })

  /**
 * Build list event data
 */
  const manageValueChangedEvent = (log: Log) => {

    const valueChangedEvent = createEvent(log);

    if (!valueChangedEventList.some(v => v.txHash === valueChangedEvent.txHash)) {
      setValueChangedEventList([valueChangedEvent, ...valueChangedEventList]);
    }
  }

  const createEvent = (log: Log): ValueChangedEventType => {
    const valueChangedEvent: ValueChangedEventType = {
      txHash: log.transactionHash?.toString(),
      oldValue: log.args.oldValue,
      newValue: log.args.newValue,
      from: log.args.who
    }
    return valueChangedEvent;
  }
  /********************* */



  /*******************************
   * Validation/Error management *
   *******************************/
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
        await writeContract({
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
      <Flex

        direction={"column"}
        rowGap={5}
        width={['100%', '100%', '50%', '50%']}>
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
        <List
          flexDirection={'column-reverse'}
          border="1px solid black"
          h="200px"
          overflowY="auto"
          w="100%"
          p="3"
          borderRadius={5}
          textAlign={"center"}
        >

          {valueChangedEventList.map((item, index) => (
            <ListItem
              key={index}>
              Value changed from {item.oldValue.toString()} to {item.newValue.toString()} by {item.from}
            </ListItem>
          ))}
        </List>
      </Flex>
    </Layout>
  );
}

export default Set;