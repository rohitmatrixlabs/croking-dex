import React, { useState } from 'react'
import './style.css'
import HomePage from './components/HomePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SwapPrice from './components/SwapPrice'
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { cronos } from './components/helperConstants';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
export default function App() {
  const [token1, setToken1] = useState("0x66e428c3f67a68878562e79A0234c1F83c208770")
  const [token2, setToken2] = useState("0xe44Fd7fCb2b1581822D0c862B68222998a0c299a")
  const [userInput, setUserInput] = useState('0')
  const [outPutTokens, setOutPutTokens] = useState(0)
  const [convertToken, setConvertToken] = useState(1)
  const [parameters, setParameters] = useState([])
  const [isCro, setIsCro] = useState(false)
  const [reload, setReload] = useState(false)
  const { chains, provider } = configureChains(
    [cronos],
    [publicProvider(), 
      jsonRpcProvider({
        rpc: () => ({
          http: `https://evm.cronos.org/`,
        }),
      }),
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
      >
    <div className='App'>
      <Navbar/>
      <HomePage setToken1={setToken1} setToken2={setToken2} setUserInput={setUserInput} userInput={userInput} outPutTokens={outPutTokens} convertToken={convertToken} token1={token1} token2={token2} setIsCro={setIsCro} parameters={parameters} isCro={isCro} setReload={setReload} reload={reload}/>
      <SwapPrice token1={token1} token2={token2} userInput={userInput} setOutPutTokens={setOutPutTokens} setConvertToken={setConvertToken} isCro={isCro} setParameters={setParameters} reload={reload}/>
      <Footer/>
    </div>
    </RainbowKitProvider>
    </WagmiConfig>
  )
}
