'use client';
import { useContext } from "react";
import { ContractContext } from "@/components/contexts/contractContext";
import { Contract } from "@/types/contract";
import Layout from "@/components/Layout";
import { Button } from "@chakra-ui/react";

// WAGMI
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError
} from "wagmi";

// Viem
import { formatEther } from "viem";

const Get = () => {

  // const { address } = useAccount();

  const { simpleStorageAbi } = useContext(ContractContext) as Contract;
  const getValue = async () => {
    // const contract = useReadContract({
    //   address: "",
    //   abi: "",
    //   functionName: "get",
    //   account: ""
    // });
    // const value = await contract.get();
    // console.log(value);
    console.log(simpleStorageAbi)
  }

  return <Layout>

    {/* <Button onClick={() => getValue()} mt="1rem">{isPending ? 'Minting...' : 'Mint'}</Button> */}
    <Button onClick={() => getValue()} mt="1rem">Get</Button>
    {/* <Button mt="1rem">Get</Button> */}

  </Layout>;
}

export default Get;