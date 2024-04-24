'use client';

import React from 'react'
import { Flex, Text, Center } from '@chakra-ui/react'
import { FooterBorderStyle, FooterTextStyle, MainTextStyle } from './style';

const Footer = () => {
    return (
        <Flex justifyContent="center"
            alignItems="center"
            p="2rem"
            sx={FooterBorderStyle}>
            <Center sx={FooterTextStyle} >
                All right reserved &copy; {new Date().getFullYear()}
            </Center>
        </Flex>
    )
}

export default Footer
