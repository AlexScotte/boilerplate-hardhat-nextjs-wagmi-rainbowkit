'use client';
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "@/src/app/components/contexts/ContractContext";
import { Contract } from "@/src/types/contract";
import Layout from "@/src/app/components/Layout";
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
import { createPublicClient, http, Chain, type PublicClient } from "viem";
import { DescriptionTextStyle, MainButtonStyle, MainCardStyle, ToastErrorStyle, ToastWarningStyle } from "@/src/app/components/style";
import { ChainID, GetExpectedChainIdWithEnv } from "@/src/utils/utils";
const Get = () => {

  const { address, isConnected, chain } = useAccount();
  const toast = useToast();
  const { simpleStorageAddress, simpleStorageAbi } = useContext(ContractContext) as Contract;
  const [storedValue, setStoredValue] = useState<string>('');
  const [expectedChainId, expectedChainViem] = GetExpectedChainIdWithEnv();
  const [publicClient, setPublicClient] = useState<PublicClient>();

  useEffect(() => {

    let publicNode = http();
    if (expectedChainId === ChainID.Sepolia) {
      publicNode = http(process.env.NEXT_PUBLIC_PROVIDER_SEPOLIA_RPC);
    }

    const publicClient = createPublicClient({
      chain: expectedChainViem as Chain,
      transport: publicNode,
    })
    setPublicClient(publicClient);

  }, [simpleStorageAddress])

  /**
   * Get the stored value from the contract
   */
  const getStoredValue = async () => {

    if (!publicClient)
      return;

    try {

      const data = await publicClient.readContract({
        address: simpleStorageAddress as `0x${string}`,
        abi: simpleStorageAbi as unknown as Abi,
        functionName: "get",
        account: address
      });

      console.log("Get stored value result:");
      console.log(`Stored value: ${data}`)
      const resultBigInt = data as BigInt;
      setStoredValue(resultBigInt.toString());

    } catch (error) {

      console.log(error);
      toast({
        title: "Error",
        description: "Error when getting stored value",
        status: "error",
        containerStyle: ToastErrorStyle
      })
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
            >
              {/* isLoading={getStoredValueLoading} */}
              Get
            </Button>

          </Flex>
        </CardBody>
      </Card>


    </Layout>
  );
}

export default Get;