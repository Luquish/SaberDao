export type IEnvironment = Readonly<{
  name: string;
  endpoint: string;
}>;

const ENDPOINTS: Record<string, string> = {
  "goki.so": "https://saber-solanam-77b6.mainnet.rpcpool.com",
  "tribeca.so": "https://saber-solanam-77b6.mainnet.rpcpool.com",
  "anchor.so": "https://saber-solanam-77b6.mainnet.rpcpool.com",
};

export const environments = {
  "mainnet-beta": {
    name: "Mainnet Beta",
    endpoint:
      ENDPOINTS[window.location.hostname] ?? process.env.REACT_APP_RPC ?? "",
  },
  devnet: {
    name: "Devnet",
    // endpoint: "https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/",
    // endpoint: "https://api.devnet.rpcpool.com/",
    endpoint: "https://api.devnet.solana.com/",
    // endpoint: "https://sg6.rpcpool.com/",
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com/",
  },
  localnet: {
    name: "Localnet",
    endpoint: "http://localhost:8899/",
  },
} as const;
