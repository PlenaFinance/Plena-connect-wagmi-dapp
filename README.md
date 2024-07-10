# Plena Finance Wallet Integration with RainbowKit and Wagmi

## Introduction

Plena Finance provides a robust wallet integration for dApps. Using Wagmi and RainbowKit, we can easily integrate Plena into a web3 application, allowing users to perform transactions and sign messages securely.

## Setup and Installation

First, ensure you have the required dependencies installed in your project:

```bash
npm install @rainbow-me/rainbowkit wagmi ethers @tanstack/react-query @plenaconnect/wagmi-connector @plenaconnect/provider
```

## Creating the Plena Rainbowkit Connector

Create a file named `plenaRainbowConnector.js` and add the following code to define the Plena rainbowkit connector:

```javascript
import { createConnector as createWagmiConnector } from "wagmi";
import { PlenaWagmiConnector } from "@plenaconnect/wagmi-connector";
import { PlenaConnectProvider } from "@plenaconnect/provider";

export const rainbowPlenaConnector = () => ({
  id: "plena",
  name: "plena",
  rdns: "plena",
  iconUrl: "https://content.plena.finance/plena.png",
  iconBackground: "#fff",
  installed: true,
  createConnector: (walletDetails) =>
    createWagmiConnector((config) => {
      const chainId = config?.storage?.["wagmi.store"]
        ? JSON.parse(config?.storage?.["wagmi.store"])?.state?.chainId
        : config.chains[0]?.id;
      const PlenaConnectInstance = new PlenaConnectProvider({
        dappToken: "YOUR DAPP TOKEN",
        dappId: "YOUR DAPP ID",
        bridgeUrl: "BRIDGE URL",
        chainId: chainId,
        chains: config.chains,
      });
      console.log("config  ", PlenaConnectInstance, config);
      return {
        ...PlenaWagmiConnector(PlenaConnectInstance)(config),
        ...walletDetails,
      };
    }),
});
```

## Configuring RainbowKit and Wagmi

Create a main file (e.g., `App.js`) and configure RainbowKit and Wagmi with the Plena rainbowkit connector:

```javascript
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { rainbowPlenaConnector } from "./lib/plenaRainbowConnector";
import Page from "./components/Page";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "plena-dapp",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, rainbowPlenaConnector],
    },
  ],
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Page />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
```

## Sending Single Transactions
To send a single transaction use Wagmi's `sendTransactionAsync` method:

```javascript
const TOKEN_ADDRESS = "0xTokenAddress"; // Replace with the actual token address

const ContractABI = [
  // Replace with the actual Contract ABI
];
const ContractInterface = new ethers.utils.Interface(ContractABI);

// Create data for the transaction
const TxnData = ContractInterface.encodeFunctionData("FUNCTION NAME", [
  PARAMETER1,
  PARAMETER2,
]);

const res = await sendTransactionAsync({
  to: TOKEN_ADDRESS,
  chainId: 137,
  data: TxnData,
});
```

## Sending Batched Transactions
To send batched transactions, first get the Plena wallet connector from the `useConnections` hook of Wagmi, and then use Plena's `sendPlenaTransaction` function with the `eth_sendTransaction` method

```javascript

const connections = useConnections();
let connector = connections[0]?.connector;

const txn1Address = "0x123..."; // Replace with actual address
const txn2Address = "0x456..."; // Replace with actual address

const Contract1ABI = [
  // Replace with actual Contract1 ABI
];

const Contract2ABI = [
  // Replace with actual Contract2 ABI
];

const Contract1 = new ethers.utils.Interface(Contract1ABI);

// Create data for the first transaction
const txn1Data = Contract1.encodeFunctionData("FUNCTION_NAME_1", [
  PARAMETER1,
  PARAMETER2,
]);

const Contract2 = new ethers.utils.Interface(Contract2ABI);

// Create data for the second transaction
const txn2Data = Contract2.encodeFunctionData("FUNCTION_NAME_2", [
  PARAMETER1,
  PARAMETER2,
]);

const res = await connector.sendPlenaTransaction({
  method: "eth_sendTransaction",
  params: [
    {
      from: walletAddress,
      chainId: chainId,
      to: [txn1Address, txn2Address],
      gasLimit: "10000000",
      data: [txn1Data, txn2Data],
    },
  ],
});
```

Please make sure the addresses and their corresponding data are in the same order.

## Signing Transactions

To sign a transaction use Plena's `sendPlenaTransaction`  function with the `personal_sign` method:

```javascript
const res = await connector.sendPlenaTransaction({
  chain: 137,
  method: "personal_sign",
  params: [msgParams],
});
```
