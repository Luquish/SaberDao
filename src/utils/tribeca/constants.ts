import { PublicKey } from "@solana/web3.js";

export const TX_REFETCH_TIME = 1_000;

export const SYNDICA_RPC_ENDPOINT = `https://solana-api.syndica.io/access-token/${
  process.env.REACT_APP_SYNDICA_ACCESS_TOKEN ?? "TOKEN_NOT_FOUND"
}/rpc`;
export const PROJECT_SERUM_RPC_ENDPOINT = "https://solana-api.projectserum.com";
export const GENESYS_GO_RPC_ENDPOINT = "https://ssc-dao.genesysgo.net";
export const API_BASE = `https://api.saber.so/api/v1`;

export enum Tags {
  DecimalWrapped = "saber-decimal-wrapped",
}

// these are all derived from each other.
export const BANK_KEY = new PublicKey(
  "G6smmw1wU7UC4oZmdxWvXjhesJib9GvjwRbQQePV3U4L"
);

export const SABER_REWARDER_KEY = new PublicKey(
  "rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk"
);
export const SABER_DAO_SMART_WALLET_KEY = new PublicKey(
  "BkkBFsRm6VCbZyBG82yuHBnyjJwUJHv1nTJ3GiY44Tkr"
);
export const SABER_EMERGENCY_DAO = new PublicKey(
  "ECq1pSyyTyRiD9SNY89uiW91ihq3XLRUN1NCdZzRyQXy"
);
export const SABER_EXECUTIVE_COUNCIL = new PublicKey(
  "Hq1K3tCMzXVePh4ViNKA12PCcrtye3sqqLRWv79vb8hp"
);

export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export const CHEST_PROGRAM_ID = new PublicKey(
  "E9vP6o8Cn77GZqnbhQjagXjFChda9f4KtDsa9TrsB37t"
);

export const CASH_MINT_STRING = "CASHVDm2wsJXfhj6VWxb7GiMdoLc17Du7paH4bNr5woT";
export const CASH_MINT = new PublicKey(
  "CASHVDm2wsJXfhj6VWxb7GiMdoLc17Du7paH4bNr5woT"
);

export const PROPOSAL_TITLE_MAX_LEN = 140;
