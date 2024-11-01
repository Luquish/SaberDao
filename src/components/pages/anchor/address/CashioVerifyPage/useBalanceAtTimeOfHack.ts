import { useToken, useTokenAccount } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { ParsedTransactionWithMeta, PublicKey } from "@solana/web3.js";

import { useSignaturesForAddress } from "../../AddressPage/TokenProgramAccountInfo/TokenAccountInfo/fetchHistoricalBalances";
import { useParsedTransaction } from "../../AddressPage/TokenProgramAccountInfo/TokenAccountInfo/useParsedTransaction";

const findBalance = (
  tx: ParsedTransactionWithMeta | null | undefined,
  token: Token | null | undefined,
  tokenAccount: PublicKey
): TokenAmount | null | undefined =>
  mapSome(token, (tok) => {
    const accountIndex = tx?.transaction.message.accountKeys.findIndex((ak) =>
      ak.pubkey.equals(tokenAccount)
    );
    return new TokenAmount(
      tok,
      tx?.meta?.postTokenBalances?.find(
        (ptb) => ptb.accountIndex === accountIndex
      )?.uiTokenAmount.amount ?? 0
    );
  });

// Sourced from https://explorer.solana.com/address/GCnK63zpqfGwpmikGBWRSMJLGLW8dsW97N4VAXKaUSSC
export const SLOT_OF_HACK = 126_266_437;

export const TIME_OF_HACK = new Date(1648023395 * 1_000);

export const useBalanceAtTimeOfHack = (tokenAccount: PublicKey) => {
  const { data: tokenAccountData } = useTokenAccount(tokenAccount);
  const { data: token } = useToken(
    mapSome(tokenAccountData, (tad) => tad.account.mint)
  );
  const { data: signatures } = useSignaturesForAddress(tokenAccount);
  const preTXSig = mapSome(
    signatures,
    (sigs) => sigs.find((sig) => sig.slot < SLOT_OF_HACK)?.signature ?? null
  );

  const { data: preTX } = useParsedTransaction(preTXSig);
  const preHackBalance = findBalance(preTX, token, tokenAccount);

  return {
    preTX,
    preHackBalance,
    preTXSig,
  };
};
