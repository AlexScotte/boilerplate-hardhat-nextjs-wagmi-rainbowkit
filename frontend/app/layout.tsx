'use client';
import '../index.css';

import { ChakraProvider } from "@chakra-ui/react";
import ContractProvider from '../components/contexts/contractContext';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';

import { WagmiProvider } from 'wagmi';
import {
  hardhat,
  sepolia,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { rainbowKitCustomTheme } from '../components/style';

const WALLET_CONNECT = process.env.NEXT_PUBLIC_WALLET_CONNECT || "";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: WALLET_CONNECT,
  chains: [hardhat, sepolia, mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={merge(darkTheme(), rainbowKitCustomTheme)}>
              <ChakraProvider
                toastOptions={{
                  defaultOptions: {
                    duration: 5000,
                    position: "bottom-right",
                    isClosable: true,
                  }
                }}>
                <ContractProvider >
                  {children}
                </ContractProvider>
              </ChakraProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
