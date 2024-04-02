'use client';

import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Header = () => {
    return (
        <Flex justifyContent="space-between"
            alignItems="center"
            p="2rem">
            <Text>
                Logo
            </Text>
            <Text>
                Connexion
            </Text>
        </Flex>
    )
}

export default Header
