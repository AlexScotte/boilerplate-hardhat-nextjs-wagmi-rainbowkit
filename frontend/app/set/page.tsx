'use client';
import Layout from "@/components/Layout";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract, ValueChangedEventType, LogWithArgs } from "@/types/contract";
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
  Card,
  CardBody,
  useToast,
  Center
} from "@chakra-ui/react";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useBlockNumber,
} from "wagmi";
import {
  type Abi,
} from 'abitype'

import { createPublicClient, http, Log, parseAbiItem, Chain } from "viem";
import { ChainID, GetExpectedChainIdWithEnv, ToShortAddress } from "@/utils/utils";
import { DescriptionSmallTextStyle, DescriptionTextStyle, MainButtonStyle, MainCardStyle, MainInputFieldStyle, MainInputStyle, MainListStyle, MainNumberIncrementStepperStyle, MainTextStyle, ToastErrorStyle, ToastInfoStyle, ToastSuccessStyle, ToastWarningStyle } from "@/components/style";

const Set = () => {
  const { address, isConnected, chain } = useAccount();
  const toast = useToast();
  const { simpleStorageDeployedBlockNumber, simpleStorageAddress, simpleStorageAbi } = useContext<Contract>(ContractContext);
  const [newValue, setNewValue] = useState<number>(0);
  const [valueChangedEventList, setValueChangedEventList] = useState<ValueChangedEventType[]>([]);
  const [expectedChainId, expectedChainViem] = GetExpectedChainIdWithEnv();
  const { data } = useBlockNumber();

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

      let publicNode = http();
      if (expectedChainId === ChainID.Sepolia) {
        publicNode = http("https://gateway.tenderly.co/public/sepolia");
      }

      const publicClient = createPublicClient({
        chain: expectedChainViem as Chain,
        transport: publicNode,
      })

      const logs = await publicClient.getLogs({
        address: simpleStorageAddress as `0x${string}`,
        event: parseAbiItem('event valueChanged(uint256 oldValue, uint256 newValue, address who)'),
        // fromBlock: simpleStorageDeployedBlockNumber ? BigInt(simpleStorageDeployedBlockNumber) : undefined,
        fromBlock: BigInt(0),
        toBlock: 'latest',
      });

      let oldEventList: ValueChangedEventType[] = [];
      logs.forEach(log => {
        const valueChangedEvent = createEvent(log as LogWithArgs);
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
      manageValueChangedEvent(logs[0] as LogWithArgs);
    }
  })

  /**
 * Build list event data
 */
  const manageValueChangedEvent = (log: LogWithArgs) => {

    const valueChangedEvent = createEvent(log);

    if (!valueChangedEventList.some(v => v.txHash === valueChangedEvent.txHash)) {
      setValueChangedEventList([valueChangedEvent, ...valueChangedEventList]);
    }
  }



  const createEvent = (log: LogWithArgs): ValueChangedEventType => {
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

      const title = "Waiting for confirmation ...";
      const description = `Transaction hash: ${hash}`;
      console.log(title);
      console.log(description);

      toast({
        title: title,
        description: description,
        status: "loading",
        containerStyle: ToastInfoStyle,
        duration: 9999999
      })
    }
  }, [isTxConfirming])

  useEffect(() => {

    if (isTxConfirmed) {
      toast.closeAll();

      const title = "Transaction confirmed !";
      const description = `Tx: ${hash}`;
      console.log(title);
      console.log(description);

      toast({
        title: title,
        description: description,
        status: "success",
        containerStyle: ToastSuccessStyle
      })
    }
  }, [isTxConfirmed])

  useEffect(() => {

    if (txConfirmationError) {

      toast({
        title: "Transaction error",
        description: `${txConfirmationError.message}`,
        status: "error",
        containerStyle: ToastErrorStyle
      })

      console.log(txConfirmationError);
    }

  }, [txConfirmationError])

  useEffect(() => {

    if (setStoredValueError) {

      toast({
        title: "Transaction error",
        description: `${setStoredValueError.message}`,
        status: "error",
        containerStyle: ToastErrorStyle
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
        containerStyle: ToastWarningStyle
      })
    }
    else {

      if (chain?.id !== expectedChainId) {

        if (typeof expectedChainViem === 'object' && 'name' in expectedChainViem) {
          toast.closeAll();
          toast({
            title: "Wrong network",
            description: `Please connect to ${expectedChainViem.name}`,
            status: "warning",
            duration: 9999999,
            containerStyle: ToastWarningStyle
          })
          return;
        }
      }

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
      <Card
        sx={MainCardStyle}
        p={5}
      >
        <CardBody>
          <Flex
            direction={"column"}
            rowGap={5}>
            <NumberInput
              sx={MainInputStyle}
              onChange={(_, valueAsNumber) => setNewValue(valueAsNumber)}
              value={newValue}
              min={0}>
              <NumberInputField
                textAlign={"end"}
                sx={MainInputFieldStyle} />
              <NumberInputStepper border={0}>
                <NumberIncrementStepper sx={MainNumberIncrementStepperStyle} />
                <NumberDecrementStepper sx={MainNumberIncrementStepperStyle} />
              </NumberInputStepper>
            </NumberInput>

            <Button
              sx={MainButtonStyle}
              onClick={() => setStoredValue()}
              isLoading={isStoredValuePending}>
              Set
            </Button>

            <List
              sx={MainListStyle}>
              {
                valueChangedEventList.length === 0 ?
                  (
                    <Center sx={DescriptionTextStyle}>No event</Center>
                  ) :
                  (
                    valueChangedEventList.map((item, index) => (
                      <ListItem
                        key={index}>
                        {
                          item.oldValue !== undefined && item.newValue !== undefined ?
                            (

                              <Center sx={DescriptionSmallTextStyle}>
                                Value changed from {item.oldValue.toString()} to {item.newValue.toString()} by {ToShortAddress(item.from)}
                              </Center>
                            ) :
                            <></>
                        }
                      </ListItem>
                    ))
                  )
              }
            </List>
          </Flex>
        </CardBody>
      </Card>
    </Layout>
  );
}

export default Set;