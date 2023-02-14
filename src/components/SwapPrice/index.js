import React, { useEffect, useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css';
import { BigNumber } from 'ethers';
import CandySwap from '../../Abi/CandySwap.json'
import CroDex from '../../Abi/CroDex.json'
import CroSwap from '../../Abi/CroSwap.json'
import MMF from '../../Abi/MMF.json'
import PhotonSwap from '../../Abi/PhotonSwap.json'
import VVS from '../../Abi/VVS.json'
import value from '../../value.json'
import Aggregator from '../../Abi/Aggregator.json'
import { findMax } from '../helperFunctions';
import {defaultTokens, photonSwapContract, mmfContract, vssContract, candySwapContract, croDexContract, aggregatorContract, allPaths, tokenContract, tokenMap, factoryContract} from '../helperConstants'
import { useSigner, useProvider } from 'wagmi'
import { ethers } from 'ethers';


export default function SwapPrice(props) {
    const {token1, token2, userInput, setOutPutTokens, setConvertToken, isCro, setParameters, reload} = props
    const { data: signer, isError, isLoading } = useSigner()
    const provider = useProvider();
    const [finalAmount, setFinalAmount] = useState(0)
    const [router, setRouter] = useState()
    const [finalPath, setFinalPath] = useState([token1, token2])
    const [pairs, setPairs] = useState()
    const [balance, setBalance] = useState(0)
    useEffect(()=>{
        setOutPutTokens(userInput*finalAmount)
    }, [userInput, token1, token2, reload])
    async function getAmountsOutFromDex(path, amountsIn, contract){
        try{
            const val = await contract.getAmountsOut(amountsIn, path);
            return val[val.length - 1]._hex.toString();
        }catch(e){
            return "0";
        }
    }
    async function getAllAmountsFromDex(path, amountsIn, dexContracts){
        const temp = [token1].concat(path, [token2])
        const action = dexContracts.map((contract) => getAmountsOutFromDex(temp, amountsIn, contract))
        return Promise.all(action).then((results) => {return results}).catch(e => console.log("hello error"))

    }
    async function getFinalAmount(){
        try {const _provider = provider?provider: new ethers.providers.JsonRpcProvider(value.rpcUrl)
        const photonSwapRouter = photonSwapContract(_provider);
        const mmfRouter = mmfContract(_provider)
        const vssRouter = vssContract(_provider)
        const croDexRouter = croDexContract(_provider)
        const candySwapRouter = candySwapContract(_provider)
        const token1Contract = tokenContract(_provider, token1)
        const deci1 = await token1Contract.decimals()
        const inputBigNumber = BigNumber.from(1).mul(BigNumber.from(10).pow(deci1))
        const token2Contract = tokenContract(_provider, token2)
        const deci2 = await token2Contract.decimals()
        const dexContracts = [photonSwapRouter, mmfRouter, croDexRouter, vssRouter, candySwapRouter];
        const multiAction = allPaths.map((path) => getAllAmountsFromDex(path, inputBigNumber, dexContracts))
        Promise.all(multiAction).then((results) => {
            const item = findMax(results)
            const result = parseFloat(ethers.utils.formatUnits(item[0], deci2))
            setFinalAmount(result)
            setConvertToken(result)
            setRouter(dexContracts[item[1]])
            setFinalPath([token1].concat(allPaths[item[1]], [token2]))
        })
        .catch(e => console.log(e))
    }
    catch(e) {console.log(e)}
    }
    useEffect(() => {
        getFinalAmount()
    },[token1, token2, reload])

    useEffect(()=>{
        const _provider = provider?provider: new ethers.providers.JsonRpcProvider(value.rpcUrl)
        async function findPairs(){
            try{
                const factory = await router.factory()
                const factoryRouter = factoryContract(_provider, factory)
                let temp = []
                for(let i = 0; i<(finalPath.length - 1); i++){
                    const pair = await factoryRouter.getPair(finalPath[i], 
                        finalPath[i+1])
                    temp.push(pair)
                }
                setPairs(temp)
                console.log(router)
            }
            catch(e){
                console.log(e)
            }
            
        }
        if(router !== null && router !== undefined)
            findPairs();
    }, [router, finalPath])
    async function getBalance(){
        try{const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const address = await provider.getSigner().getAddress();
        const token1Contract = tokenContract(provider, token1)
        let balance1 = 0;
        if(isCro){
            balance1 = await provider.getBalance(address)
        }
        else
        {balance1 = await token1Contract.balanceOf(address)}
        setBalance(balance1)
        console.log("jdfsajf", balance1)}
        catch(e){
            console.log(e, "Error in fetching Balance")
        }
    }
    useEffect(()=>{
        
        if(window.ethereum){
            getBalance();
        }
    }, [token1, reload])

    useEffect(()=>{
        console.log(balance)
        setParameters([balance, router, finalPath, pairs])
    }, [balance, router, finalPath, pairs, reload])
  return (
    <>
    <div>{}</div>
    <div>{}</div>
    </>
  )
}
