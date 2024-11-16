import { utils } from "@project-serum/anchor";
import { usePubkey, useSail, useToken } from "@rockooor/sail";
import type { Token } from "@saberhq/token-utils";
import {
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import { TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { useLocation } from "@reach/router";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";
import { RouteComponentProps } from '@reach/router';

import { useParseTokenAmount } from "@/hooks/tribeca/useParseTokenAmount";
import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useTokenAccounts } from "@/hooks/tribeca/useTokenAccounts";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { MEMO_PROGRAM_ID } from "@/utils/tribeca/constants";
import { shortenAddress } from "@/utils/tribeca/utils";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { InputTokenAmount } from "@/components/tribeca/common/inputs/InputTokenAmount";
import { BasicPage } from "@/components/tribeca/common/page/BasicPage";

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const tokenMint = paths[paths.indexOf('treasury') + 2] || '';
  return { tokenMint };
}

export const WalletTreasurySendView: React.FC<RouteComponentProps> = () => {
  const location = useLocation();
  const { tokenMint: tokenMintStr } = getParams(location.pathname);
  const { key, smartWallet } = useSmartWallet();
  const {
    data: treasuryTokenAccounts,
    isLoading: userIsLoading,
    isSuccess,
  } = useTokenAccounts(key);
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  const isLoading = !isSuccess || userIsLoading;

  const [toStr, setToStr] = useState<string>("");
  const to = usePubkey(toStr);
  const { data: token } = useToken(usePubkey(tokenMintStr));
  const [amountStr, setAmountStr] = useState<string>("");
  const amount = useParseTokenAmount(token, amountStr);
  const [memo, setMemo] = useState<string>("");

  const selectedAccount = token
    ? treasuryTokenAccounts?.find((t) => t?.balance.token.equals(token))
    : null;

  return (
    <BasicPage title="Send funds" description="Send tokens to another account.">
      <div className="p-4 w-full max-w-md mx-auto border rounded flex flex-col gap-4">
        <div className="rounded border p-4 bg-gray-50">
          <InputTokenAmount
            label="Transfer Amount"
            isLoading={isLoading}
            tokens={
              treasuryTokenAccounts
                ?.map((ta) => ta?.balance.token)
                .filter((t): t is Token => !!t) ?? []
            }
            token={token ?? null}
            onTokenSelect={(nextToken) => {
              void navigate(
                `/tribeca/wallets/${key.toString()}/treasury/send/${nextToken.address}`
              );
            }}
            inputValue={amountStr}
            inputOnChange={setAmountStr}
            currentAmount={
              selectedAccount
                ? {
                    label: "Treasury Balance",
                    amount: selectedAccount.balance,
                    allowSelect: true,
                  }
                : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Recipient</span>
          <InputText
            type="text"
            value={toStr}
            placeholder={`Recipient's address`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setToStr(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Memo (optional)</span>
          <InputText
            type="text"
            value={memo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMemo(e.target.value);
            }}
          />
        </div>
        <div>
          <AsyncButton
            variant="primary"
            size="md"
            className="w-full"
            disabled={!smartWallet || !selectedAccount || !amount || !to}
            onClick={async (sdkMut) => {
              invariant(
                smartWallet && selectedAccount && amount && to,
                "selected account"
              );

              const provider = sdkMut.provider;
              const initTX = provider.newTX([]);

              const destATA = await getOrCreateATA({
                provider: sdkMut.provider as any,
                mint: amount.token.mintAccount,
                owner: to,
              });
              if (destATA.instruction) {
                initTX.instructions.push(destATA.instruction);
              }
              const transferIX = SPLToken.createTransferCheckedInstruction(
                TOKEN_PROGRAM_ID,
                selectedAccount.account,
                amount.token.mintAccount,
                destATA.address,
                key,
                [],
                amount.toU64(),
                amount.token.decimals
              );
              const sendTX = provider.newTX([
                transferIX,
                memo
                  ? new TransactionInstruction({
                      programId: MEMO_PROGRAM_ID,
                      keys: [],
                      data: Buffer.from(utils.bytes.utf8.encode(memo)),
                    })
                  : null,
              ]);
              const { tx: proposeTX } = await smartWallet.newTransaction({
                instructions: sendTX.instructions,
              });
              await handleTX(
                await wrapTx(initTX.combine(proposeTX)),
                `Proposal: send ${amount.formatUnits()} to ${shortenAddress(
                  to.toString()
                )}`
              );
            }}
          >
            Send
          </AsyncButton>
        </div>
      </div>
    </BasicPage>
  );
};
