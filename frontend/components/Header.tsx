'use client';

import { Flex, Text, Stack } from '@chakra-ui/react'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link'

const Header = () => {
    return (
        <Flex justifyContent="space-between"
            alignItems="center"
            p="2rem">
            <Text>
                Logo
            </Text>


            <Stack
                direction="row"
                alignItems="center"
                spacing={100}>

                <Link
                    href="/get"
                >
                    {/* className={
                  "item-menu " +
                  (currentRoute === "/Inventory"
                    ? "item-menu-active"
                    : "item-menu-non-active")
                } */}
                    Get
                </Link>
                <Link
                    href="/set"
                >
                    {/* className={
                  "item-menu " +
                  (currentRoute === "/Inventory"
                    ? "item-menu-active"
                    : "item-menu-non-active")
                } */}
                    Set
                </Link>
            </Stack>

            <ConnectButton />
        </Flex>
    )
}

export default Header
