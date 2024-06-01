import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Flex } from '@chakra-ui/react'
import { BodyBorderStyle } from './style'

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div style={{ 
            // backgroundImage: `url(${process.env.PUBLIC_URL + '/backgrounds/1.png'})`,
            backgroundImage: `url(./backgrounds/6.png)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}>

        <Flex direction="column"
            h="100vh"
            justifyContent="center"
        >

            <Header/>
            
            <Flex
                grow={1}
                justifyContent="center"
                alignItems="center"
                sx={BodyBorderStyle}
               >
                {children}
            </Flex>
            
            <Footer />

        </Flex>
        </div>

    )
}

export default Layout