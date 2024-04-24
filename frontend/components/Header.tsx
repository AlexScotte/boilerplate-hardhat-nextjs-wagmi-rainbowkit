'use client';

import { Flex, Text, Stack, Card, CardBody } from '@chakra-ui/react'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { HeaderBorderStyle, MainTextStyle, NavItemActiveStyle, NavItemNonActiveStyle, ToastWarningStyle } from "@/components/style";
import { useAccount } from 'wagmi'
import { useToast } from "@chakra-ui/react";

import { GetExpectedChainIdWithEnv } from "@/utils/utils";


const Header = () => {
    
    const currentRoute = usePathname();
    const { chain } = useAccount();
    const toast = useToast();
    const [expectedChainId, expectedChainViem] = GetExpectedChainIdWithEnv();

    useEffect(() => {

        if(!chain){
            console.log("undefined chain return");
            return;
        }

        if (chain.id !== expectedChainId) {
            toast.closeAll();

            toast({
                title: "Wrong network",
                description: `Please switch to ${expectedChainViem.name} network`,
                status: "warning",
                duration: 9000000000,
                containerStyle: ToastWarningStyle
            })
        }
        else{
            toast.closeAll();
        }
      }, [chain])


    return (
        <Flex justifyContent="space-between"
            alignItems="center"
            p="2rem" 
            sx={HeaderBorderStyle}
            >
            <Text>
                Logo
            </Text>


            <Stack
                direction="row"
                alignItems="center"
                spacing={100}>

                <Link href="/get">
                    <Card sx={(currentRoute === "/get"
                            ? NavItemActiveStyle
                            : NavItemNonActiveStyle)}>
                        <CardBody>
                            <Text sx={MainTextStyle}>
                                GET
                            </Text>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/set">
                    <Card sx={(currentRoute === "/set"
                            ? NavItemActiveStyle
                            : NavItemNonActiveStyle)}>
                        <CardBody>
                        <Text sx={MainTextStyle}>
                                SET
                            </Text>
                        </CardBody>
                    </Card>
                </Link>
            </Stack>

            <ConnectButton />
        </Flex>
    )
}

export default Header
