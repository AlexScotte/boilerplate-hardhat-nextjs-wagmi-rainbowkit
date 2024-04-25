'use client';
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract } from "@/types/contract";
import Layout from "@/components/Layout";
import { Button, Text, Flex, Center } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
// WAGMI
import {
  useAccount,
  useReadContract,
  type BaseError
} from "wagmi";
import {
  type Abi,
} from 'abitype'
import { DescriptionTextStyle, MainButtonStyle, MainCardStyle, ToastErrorStyle, ToastWarningStyle } from "@/components/style";
import { GetExpectedChainIdWithEnv } from "@/utils/utils";

const Get = () => {

  const { address, isConnected, chain } = useAccount();
  const toast = useToast();
  const { simpleStorageAddress, simpleStorageAbi } = useContext(ContractContext) as Contract;
  const [storedValue, setStoredValue] = useState<string>('');
  const [expectedChainId, expectedChainViem] = GetExpectedChainIdWithEnv();


  const {
    data: data,
    isLoading: getStoredValueLoading,
    error: getStoredValueError,
    refetch: refetchStoredValue
  } = useReadContract({
    address: simpleStorageAddress as `0x${string}`,
    abi: simpleStorageAbi as unknown as Abi,
    functionName: "get",
    account: address
  });


  /**
   * Get the stored value from the contract
   */
  const getStoredValue = async () => {


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

      const result = await refetchStoredValue();
      console.log("Get stored value result:");
      console.log(result);

      if (result.status === "success") {

        console.log(`Stored value: ${result.data}`)
        const resultBigInt = result.data as BigInt;
        setStoredValue(resultBigInt.toString());
      }
      else {

        toast({
          title: "Error",
          description: "Error when getting stored value",
          status: "error",
          containerStyle: ToastErrorStyle
        })
      }
    }
  }



  return (
    <Layout>

      <Card
        sx={MainCardStyle}>
        <CardBody>

          <Flex
            direction={"column"}
            rowGap={5}>

            <Text textAlign={"center"}
              sx={DescriptionTextStyle}>
              Stored value: <Text sx={DescriptionTextStyle} as='b'>{storedValue}</Text>
            </Text>

            <Button
              sx={MainButtonStyle}
              onClick={() => getStoredValue()}
              mt="1rem"
              isLoading={getStoredValueLoading}
            >
              Get
            </Button>

          </Flex>
        </CardBody>
      </Card>


    </Layout>
  );
}

export default Get;