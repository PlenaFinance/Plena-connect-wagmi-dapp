import React, { useEffect, useState } from "react";import {
  useAccount,
  useDisconnect,
  useSendTransaction,
  useConnections,
  useChainId,
  useWaitForTransactionReceipt
} from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import SendTxnModal from "../Modals/sendTxnModal";
import SignMessageModal from "../Modals/signMessageModal";
import { ethers } from "ethers";
import { eip1271 } from "../utils/eip1271";
import TransactionModal from "../Modals/sendSingleTxnModal";
import { hashMessage } from "../utils/utilities";

function Page() {
  const account = useAccount();
  const walletAddress = account?.address;
  const { disconnect } = useDisconnect();
  const connections = useConnections();
 
  const {
    data: hash,
    isPending: isTransactionPending,
    isError: isTransactionError,
    sendTransactionAsync,
  } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed ,error:txnError ,  } =
    useWaitForTransactionReceipt({
      hash,
    })

  const chainId = useChainId();
  const { address } = account || "";
  let connector = connections[0]?.connector;
  const [pending, setPending] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const [isTxnModal2Open, setIsTxnModal2Open] = useState(false);
  const [result, setResult] = useState(null);
 


  const openTxnModal = () => {
    setIsTxnModalOpen(true);
  };
  const openTxnModal2 = () => {
    setIsTxnModal2Open(true);
  };

  const openSignModal = () => {
    setIsSignModalOpen(true);
  };

  const closeTxnModal = () => {
    setIsTxnModalOpen(false);
    setIsTxnModal2Open(false);
    setPending(false);
    setResult(false);
  };

  const closeSignModal = () => {
    setIsSignModalOpen(false);
    setPending(false);
    setResult(false);
  };
  const utf8ToHex = (str) => {
    const bytes = ethers.utils.toUtf8Bytes(str);
    const hex = ethers.utils.hexlify(bytes);
    return hex;
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
                gasLimit:"10000000",
                data: [approveData,lendData], 
              },
            ],
          });
          
      console.log("send plena transaction", res);
      if (!res?.success) {
        setResult(false);
        return;
      }
     
      const formattedResult = {
        method: 'send_transaction',
        txHash: res?.content?.transactionHash,
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

  const testSingleTransaction = async()=>{
    openTxnModal2();
    setPending(true);

    const AAVE_V3_POOL_POLYGON = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    const amount = "1000000";
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
try{
    const res = await sendTransactionAsync({
      to:USDT,
      chainId:137,
      data:approveData
    })
    if (!res?.success) {
      setResult(false);
      return;
    }
   
    const formattedResult = {
      method: 'send_transaction',
      txHash: res?.content?.transactionHash,
      from: walletAddress,
    };
    setResult(formattedResult);
  }catch (error) {
    console.log("error", error);
    setResult(null);
  } finally {
    setPending(false);
  }
};






 
 const testSignTransaction = async () => {
    openSignModal();
    setPending(true);
    try {
      const message = `My email is john@doe.com - ${new Date().toUTCString()}`;
      const hexMsg = utf8ToHex(message);
      const msgParams = [hexMsg, walletAddress];
      
      const res = await connector.sendPlenaTransaction({
        chain: 137,
        method: "personal_sign",
        params: [
         msgParams
        ],
      });
      console.log(res);
      if (!res?.success) {
        setResult(false);
        return;
      }
      // const hash = hashMessage(message);
      // const polygonProvider = new ethers.providers.JsonRpcProvider(
      //   "https://polygon-rpc.com/"
      // );
      // const valid = await eip1271.isValidSignature(
      //   walletAddress,
      //   res?.content?.signature,
      //   hash,
      //   polygonProvider
      // );
      const formattedResult = {
        method: 'personal_sign',
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
      {account.status !== 'connected' ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="mb-8 text-2xl font-bold">Welcome to Plena Connect</h1>
          <ConnectButton />
        </div>
      ) : (
        <div className="h-screen flex flex-col justify-center items-center mt-8 bg-gray-100">
        <ConnectButton className="mb-10" />
        <div className="h-auto w-96 p-6 bg-white mt-4 border-3 border-solid border-[#985AFF] rounded-2xl shadow-2xl transform transition duration-300 hover:scale-105">
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800">Methods</h1>
            <div className="flex flex-col w-full space-y-4">
              <button
                className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
                onClick={testSignTransaction}
              >
                Personal Sign
              </button>
              <button
                className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
                onClick={testSingleTransaction}
              >
                Send Single Transaction
              </button>
              <button
                className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
                onClick={testSendTransaction}
              >
                Send Batch Transaction
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
      <SendTxnModal
        isModalOpen={isTxnModal2Open}
        onCancel={closeTxnModal}
        pendingRequest={pending}
        result={result}
      />
   
      <SignMessageModal
        isModalOpen={isSignModalOpen}
        onCancel={closeSignModal}
        pendingRequest={pending}
        result={result}
      />
    </>
  );
}

export default Page;
