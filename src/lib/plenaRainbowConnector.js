import { createConnector as createWagmiConnector } from "wagmi";
// import { PlenaWagmiConnector } from "./PlenaWagmi.js";
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
        dappToken:
          "91651531fc0ff6f89808b72c7ca0fcda6a9816a225e33f4b226e5bfdadccf776007dee0a61aa8bfd8f32ceed5c3374da4b820f51b1dd1829c441aaa4eee83891",
        dappId: "cm61ds5dotv8m80olbig",
        bridgeUrl: "connect.plena.finance",
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
