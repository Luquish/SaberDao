import { mapSome } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { mapValues } from "lodash-es";

import { useStaticGetRequest } from "../../../../../hooks/useStaticGetRequest";

export type CashioHackedAccountType =
  | "wallet"
  | "miner"
  | "merge-miner"
  | "sunny-vault"
  | "tulip"
  | "chest-vault";

export interface HistoricalBalance {
  slot: number;
  time: number;
  txSig: string;
  amount?: string;
}

interface RawCashioHackedAccount {
  tokenName: string;
  account: string;
  type: CashioHackedAccountType;
  owner: string;

  amount: number;
  price: number | null;
  usdValue: number | null;
  historical?: HistoricalBalance;
}
export interface RawCashioSolanaReimbursement {
  signature: string;
  source: string;
  destination: string;
  mint: string;
  amount: string;
  destinationOwner: string;
}

interface CashioReview {
  reason: string;
  decision: string;
  over100K: boolean | null;
  estimatedDollarValue: number | null;
}

interface CashioSubmission {
  selfReportedAddress: string;
  submissionIsValid: boolean;
  submissionInvalidReason: string | null;
  owner?: string;
  ethAddress?: string;
  originalWallet?: string;
  ownershipTxSig?: string;
  provenanceTxSig?: string;
  balance?: string;
  source?: string;
  messageText?: string;
  signatureIsVerified?: boolean;
  rawMessage?: string;
  rawSignature?: string;
  submissionID?: string;
}

export interface CashioHackedAccount
  extends Omit<RawCashioHackedAccount, "account" | "owner"> {
  account: PublicKey;
  owner: PublicKey;
}

export interface RawFullAccount {
  tokenAccounts: readonly RawCashioHackedAccount[];
  reimbursements: readonly RawCashioSolanaReimbursement[];
  ethReimbursements: readonly EthereumHackerReimbursement[];
  review?: CashioReview;
  submission?: CashioSubmission;
  solanaAddresses: readonly string[];
  summary: {
    totalLosses: number;
    totalRefunds: number;
    totalEthRefunds: number;
    ethRefundPercent: number | null;
    netLosses: number;
  };
}
export interface EthereumHackerReimbursement {
  tx: string;
  to: string;
  value: string;
}

export interface FullAccount extends Omit<RawFullAccount, "tokenAccounts"> {
  tokenAccounts: readonly CashioHackedAccount[];
}

const parseCashioUBOs = (
  data:
    | Readonly<Record<string, readonly RawCashioHackedAccount[]>>
    | null
    | undefined
):
  | Readonly<Record<string, readonly CashioHackedAccount[]>>
  | null
  | undefined =>
  mapSome(data, (d) => {
    return mapValues(d, (v) => {
      return v.map(({ account, owner, ...rest }) => ({
        ...rest,
        account: new PublicKey(account),
        owner: new PublicKey(owner),
      }));
    });
  });

const parseCashioUBOsFull = (
  data: Readonly<Record<string, RawFullAccount>> | null | undefined
): Readonly<Record<string, FullAccount>> | null | undefined =>
  mapSome(data, (d) => {
    return mapValues(d, (v) => {
      return {
        ...v,
        tokenAccounts: v.tokenAccounts.map(({ account, owner, ...rest }) => ({
          ...rest,
          account: new PublicKey(account),
          owner: new PublicKey(owner),
        })),
      };
    });
  });

export const useAllCashioUBOs = () => {
  return useStaticGetRequest<
    Readonly<Record<string, readonly RawCashioHackedAccount[]>>,
    Readonly<Record<string, readonly CashioHackedAccount[]>>
  >(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/summary.json`,
    {
      select: parseCashioUBOs,
    }
  );
};

export const useAllCashioUBOsFull = () => {
  return useStaticGetRequest<
    Readonly<Record<string, RawFullAccount>>,
    Readonly<Record<string, FullAccount>>
  >(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/full.json`,
    {
      select: parseCashioUBOsFull,
    }
  );
};

export const useCashioHackUBOInfo = (uboAddress: string) => {
  return useStaticGetRequest<
    readonly RawCashioHackedAccount[],
    readonly CashioHackedAccount[]
  >(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/by-ubo/${uboAddress}.json`,
    {
      select: (data) =>
        mapSome(data, (d) =>
          d.map(({ account, owner, ...rest }) => ({
            ...rest,
            account: new PublicKey(account),
            owner: new PublicKey(owner),
          }))
        ),
    }
  );
};

export const useCashioHackUBOFullInfo = (uboAddress: string) => {
  return useStaticGetRequest<RawFullAccount, FullAccount>(
    `https://raw.githubusercontent.com/cashioapp/cashio-hack-index/master/data/by-ubo/${uboAddress}-full.json`,
    {
      select: (data) =>
        mapSome(data, ({ tokenAccounts, ...d }) => {
          const parsedTokenAccounts = tokenAccounts.map(
            ({ account, owner, ...rest }) => ({
              ...rest,
              account: new PublicKey(account),
              owner: new PublicKey(owner),
            })
          );
          return {
            ...d,
            tokenAccounts: parsedTokenAccounts,
          };
        }),
    }
  );
};
