import React, { useEffect, useState } from "react";import {
  useAccount,
  useDisconnect,
  useSendTransaction,
  useConnections,
  useChainId,
  useWaitForTransactionReceipt
} from "wagmi";
import Header from "./Header";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SendTxnModal from "../Modals/sendTxnModal";
import SignMessageModal from "../Modals/signMessageModal";
import { ethers } from "ethers";
import { eip1271 } from "../utils/eip1271";
import { convertUtf8ToHex} from '@plenaconnect/utils';
import { hashMessage } from "../utils/utilities";
import { utf8ToHex } from "../utils/utf8ToHex";
function Page() {
  const account = useAccount();
  const walletAddress = account?.address;
  const { disconnect } = useDisconnect();
  const connections = useConnections();
 
  const { 
    data: hash, 
    isPending, 
    sendTransaction 
  } = useSendTransaction() 
  
  const { isLoading: isConfirming, isSuccess: isConfirmed ,error:txnError } =
    useWaitForTransactionReceipt({
      hash,
    })

  const chainId = useChainId();
  const { address } = account || "";
  let connector = connections[0]?.connector;
  const [pending, setPending] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  // async function handleSendTransaction1() {
  //   sendTransaction({
  //     to: address,
  //     value: address,
  //     chainId: chainId,
  //     data: address,
  //   });
  //   console.log("await response");
  // }

  // async function handleSendBatchTranscation() {
  //   const result = await connector.sendPlenaTransaction({
  //     method: "eth_sendTransaction",
  //     params: [
  //       {
  //         from: address,
  //         chainId: chainId,
  //         to: [address, address],
  //         data: [address], // Plena Wallet Address
  //       },
  //     ],
  //   });
  //   console.log("send plena transaction", result);
  // }

  // console.log("account", account);


  const openTxnModal = () => {
    setIsTxnModalOpen(true);
  };

  const openSignModal = () => {
    setIsSignModalOpen(true);
  };

  const closeTxnModal = () => {
    setIsTxnModalOpen(false);
    setPending(false);
    setResult(false);
  };

  const closeSignModal = () => {
    setIsSignModalOpen(false);
    setPending(false);
    setResult(false);
  };

  const testSendTransaction = async () => {
    openTxnModal();
    setPending(true);

    const AAVE_V3_POOL_POLYGON = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    const amount = "1000000";

    const aaveABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "onBehalfOf",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "referralCode",
            type: "uint16",
          },
        ],
        name: "supply",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ]; 

    const erc20ABI = [
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const approveContract = new ethers.utils.Interface(erc20ABI);

    //Create data for approving token for lending pool
    const approveData = approveContract.encodeFunctionData("approve", [
      AAVE_V3_POOL_POLYGON,
      amount,
    ]);
    
    const lendContract = new ethers.utils.Interface(aaveABI);

    //Create data for lending on Aave
    const lendData = lendContract.encodeFunctionData("supply", [
      USDT,
      amount,
      walletAddress,
      "0",
    ]);

     try {
      const res = await connector.sendPlenaTransaction({
            method: "eth_sendTransaction",
            params: [
              {
                from: walletAddress,
                chainId: chainId,
                to: [USDT, AAVE_V3_POOL_POLYGON],
               
                data: [approveData,lendData], 
              },
            ],
          });
          console.log("send plena transaction", res);
      if (!res?.success) {
        setResult(false);
        return;
      }
      
    } catch (error) {
      console.log("error", error);  
    } 
    finally {
      setPending(false);
    }
  };

 
 const testSignTransaction = async () => {
    openSignModal();
    setPending(true);
    try {
      const message = `My email is john@doe.com - ${new Date().toUTCString()}`;
      const hexMsg = convertUtf8ToHex(message);
      const msgParams = [hexMsg, walletAddress];
      console.log("msgParams", msgParams);
      const res = await connector.sendPlenaTransaction({
        chain: 137,
        method: "personal_sign",
        params: [
        
            msgParams
          
        ],
      });
      if (!res?.success) {
        setResult(false);
        return;
      }
      const hash = hashMessage(message);
      const polygonProvider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );
      const valid = await eip1271.isValidSignature(
        walletAddress,
        res?.content?.signature,
        hash,
        polygonProvider
      );
      const formattedResult = {
        method: "personal_sign",
        signature: res?.content?.signature,
        from: walletAddress,
      };
      setResult(formattedResult);
    } catch (error) {
      console.log("error", error);
      setResult(null);
    } finally {
      setPending(false);
    }
  };


  return (
    <>
      {account.status !== "connected" ? (
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='mb-8 text-2xl font-bold'>Welcome to Plena Connect</h1>
          <ConnectButton />
        </div>
      ) : (
        <div className='h-100 flex justify-center items-center mt-8'>
      <div className='h-4/5 w-82 border-3 border-solid border-[#985AFF] rounded-2xl flex flex-col items-center'>
        <div className='flex flex-col items-center justify-center mt-8'>
        <ConnectButton  />
          <h1 className='mb-8 text-2xl mt-10'>Methods</h1>
          <div className='flex flex-col h-auto'>
            <button
              className='bg-[#985AFF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#7b47d6] transition ease-in-out duration-300 mb-4'
              onClick={testSignTransaction}
            >
              Personal Sign
            </button>
            <button
              className='bg-[#985AFF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#7b47d6] transition ease-in-out duration-300 mt-8 mb-4'
              onClick={testSendTransaction}
            >
              Send Transaction
            </button>
            <button
              className='bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition ease-in-out duration-300 mb-8 mx-2 mt-40'
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
        <SendTxnModal
        isModalOpen={isTxnModalOpen}
        onCancel={closeTxnModal}
        pendingRequest={pending}
        result={result}
      />
      <SignMessageModal
        isModalOpen={isSignModalOpen}
        onCancel={closeSignModal}
        pendingRequest={isPending}
        result={result}
      />
    </>
  );
}

export default Page;
