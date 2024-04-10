'use client';
import { useContext, useEffect } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract } from "@/types/contract";
import Layout from "@/components/Layout";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
// WAGMI
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError
} from "wagmi";
import {
  type Abi,
} from 'abitype'
import { readContract } from '@wagmi/core'

import { formatEther } from "viem";
const Get = () => {

  const { address, isConnected } = useAccount();
  const toast = useToast();
  const { simpleStorageAddress, simpleStorageAbi } = useContext(ContractContext) as Contract;


  const {
    data: storedValue,
    isLoading: getStoredValueLoading,
    error: getStoredValueError,
    refetch: refetchStoredValue
  } = useReadContract({
    address: simpleStorageAddress as `0x${string}`,
    abi: simpleStorageAbi as unknown as Abi,
    //   "inputs": [
    //     {
    //       "internalType": "address",
    //       "name": "_initialOwner",
    //       "type": "address"
    //     }
    //   ],
    //   "stateMutability": "nonpayable",
    //   "type": "constructor"
    // },
    // {
    //   "inputs": [
    //     {
    //       "internalType": "address",
    //       "name": "owner",
    //       "type": "address"
    //     }
    //   ],
    //   "name": "OwnableInvalidOwner",
    //   "type": "error"
    // },
    // {
    //   "inputs": [
    //     {
    //       "internalType": "address",
    //       "name": "account",
    //       "type": "address"
    //     }
    //   ],
    //   "name": "OwnableUnauthorizedAccount",
    //   "type": "error"
    // },
    // {
    //   "anonymous": false,
    //   "inputs": [
    //     {
    //       "indexed": true,
    //       "internalType": "address",
    //       "name": "previousOwner",
    //       "type": "address"
    //     },
    //     {
    //       "indexed": true,
    //       "internalType": "address",
    //       "name": "newOwner",
    //       "type": "address"
    //     }
    //   ],
    //   "name": "OwnershipTransferred",
    //   "type": "event"
    // },
    // {
    //   "anonymous": false,
    //   "inputs": [
    //     {
    //       "indexed": false,
    //       "internalType": "uint256",
    //       "name": "oldValue",
    //       "type": "uint256"
    //     },
    //     {
    //       "indexed": false,
    //       "internalType": "uint256",
    //       "name": "newValue",
    //       "type": "uint256"
    //     },
    //     {
    //       "indexed": false,
    //       "internalType": "address",
    //       "name": "who",
    //       "type": "address"
    //     }
    //   ],
    //   "name": "valueChanged",
    //   "type": "event"
    // },
    // {
    //   "inputs": [],
    //   "name": "get",
    //   "outputs": [
    //     {
    //       "internalType": "uint256",
    //       "name": "",
    //       "type": "uint256"
    //     }
    //   ],
    //   "stateMutability": "view",
    //   "type": "function"
    // },
    // {
    //   "inputs": [],
    //   "name": "owner",
    //   "outputs": [
    //     {
    //       "internalType": "address",
    //       "name": "",
    //       "type": "address"
    //     }
    //   ],
    //   "stateMutability": "view",
    //   "type": "function"
    // },
    // {
    //   "inputs": [],
    //   "name": "renounceOwnership",
    //   "outputs": [],
    //   "stateMutability": "nonpayable",
    //   "type": "function"
    // },
    // {
    //   "inputs": [
    //     {
    //       "internalType": "uint256",
    //       "name": "value",
    //       "type": "uint256"
    //     }
    //   ],
    //   "name": "set",
    //   "outputs": [],
    //   "stateMutability": "nonpayable",
    //   "type": "function"
    // },
    // {
    //   "inputs": [
    //     {
    //       "internalType": "address",
    //       "name": "newOwner",
    //       "type": "address"
    //     }
    //   ],
    //   "name": "transferOwnership",
    //   "outputs": [],
    //   "stateMutability": "nonpayable",
    //   "type": "function"
    // }],
    functionName: "get",
    account: address
  });

  const { data: hash, error: airdropError, isPending, writeContract } = useWriteContract()


  // useEffect(() => {
  //   console.log(getStoredValueError);

  //   toast({
  //     title: "Error get stored value",
  //     description: getStoredValueError?.message,
  //     status: "error",
  //     duration: 5000,
  //     isClosable: true,
  //   })

  // }, [getStoredValueError])

  useEffect(() => {
    console.log("getStoredValueLoading");
    console.log(getStoredValueLoading);
  }, [getStoredValueLoading])

  const getStoredValue = async () => {

    if (!isConnected) {

      toast({
        title: "Not connected",
        description: "Please connect your wallet",
        status: "warning",
        duration: 5000,
        isClosable: true,
      })
    }
    else {

      const data = await readContract({}, {
        address: simpleStorageAddress,
        abi: simpleStorageAbi,
        functionName: 'get',
        args: [],
      })

      console.log(data);
      // const test = await refetchStoredValue();
      // console.log(test);

      // writeContract({
      //   // address: simpleStorageAddress as `0x${string}`,
      //   address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      // abi: simpleStorageAbi as unknown as Abi,
      //   functionName: 'set',
      //   account: address,
      //   args: [6]
      // });
    }
  }



  return (
    <Layout>
      {/* <Button onClick={() => getValue()} mt="1rem">{isPending ? 'Minting...' : 'Mint'}</Button> */}



      <Button
        onClick={() => getStoredValue()}
        mt="1rem"
        isLoading={getStoredValueLoading}>
        Get</Button>

    </Layout>
  );
}

export default Get;