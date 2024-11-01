import { shortenAddress } from "@cardinal/namespaces";
import { utils } from "@project-serum/anchor";
import { usePubkey, useSail } from "@rockooor/sail";
import type { Token } from "@saberhq/token-utils";
import {
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import { TransactionInstruction } from "@solana/web3.js";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../hooks/useParseTokenAmount";
import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import type { TokenAccountWithInfo } from "../../../../hooks/useTokenAccounts";
import { useTokenAccounts } from "../../../../hooks/useTokenAccounts";
import { useWrapTx } from "../../../../hooks/useWrapTx";
import { MEMO_PROGRAM_ID } from "../../../../utils/constants";
import { AsyncButton } from "../../../common/AsyncButton";
import { InputText } from "../../../common/inputs/InputText";
import { InputTokenAmount } from "../../../common/inputs/InputTokenAmount";
import { BasicPage } from "../../../common/page/BasicPage";

export const WalletSendsView: React.FC = () => {
  const { key } = useSmartWallet();
  const {
    data: tokenAccounts,
    isLoading: userIsLoading,
    isSuccess,
  } = useTokenAccounts(key);
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  const isLoading = !isSuccess || userIsLoading;
  const [token, setToken] = useState<Token | null>(null);
  const [toStr, setToStr] = useState<string>("");
  const [amountStr, setAmountStr] = useState<string>("");
  const to = usePubkey(toStr);
  const amount = useParseTokenAmount(token, amountStr);
  const [memo, setMemo] = useState<string>("");

  const tokenAccountsWithGreatestBalance = useMemo(() => {
    const mintBalanceMap: Record<string, TokenAccountWithInfo> = {};

    tokenAccounts?.forEach((tknAcc) => {
      const existingAcc = mintBalanceMap[tknAcc.balance.token.address];
      if (!existingAcc) {
        mintBalanceMap[tknAcc.balance.token.address] = tknAcc;
      } else {
        if (tknAcc.balance.greaterThan(existingAcc.balance)) {
          mintBalanceMap[tknAcc.balance.token.address] = tknAcc;
        }
      }
    });
    return Object.values(mintBalanceMap);
  }, [tokenAccounts]);

  const selectedAccount = token
    ? tokenAccountsWithGreatestBalance?.find((t) =>
        t?.balance.token.equals(token)
      )
    : null;

  return (
    <BasicPage title="Send funds" description="Send tokens to another account.">
      <div tw="p-4 w-full max-w-md mx-auto border rounded flex flex-col gap-4">
        <div tw="rounded border p-4 bg-gray-50">
          <InputTokenAmount
            label="Transfer Amount"
            isLoading={isLoading}
            tokens={
              tokenAccountsWithGreatestBalance
                ?.filter((ta) => !ta.balance.isZero())
                ?.map((ta) => ta?.balance.token)
                .filter((t): t is Token => !!t) ?? []
            }
            onTokenSelect={setToken}
            token={token ?? null}
            inputValue={amountStr}
            inputOnChange={setAmountStr}
            currentAmount={
              selectedAccount
                ? {
                    label: "Balance",
                    amount: selectedAccount.balance,
                    allowSelect: true,
                  }
                : undefined
            }
          />
        </div>
        <div tw="flex flex-col gap-2 text-sm">
          <span tw="font-medium">Recipient</span>
          <InputText
            type="text"
            value={toStr}
            placeholder={`Recipient's address`}
            onChange={(e) => {
              setToStr(e.target.value);
            }}
          />
        </div>
        <div tw="flex flex-col gap-2 text-sm">
          <span tw="font-medium">Memo (optional)</span>
          <InputText
            type="text"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
          />
        </div>
        <div>
          <AsyncButton
            variant="primary"
            size="md"
            tw="w-full"
            disabled={!selectedAccount || !amount || !to}
            onClick={async (sdkMut) => {
              invariant(selectedAccount && amount && to, "selected account");

              const provider = sdkMut.provider;
              const initTX = provider.newTX([]);

              const destATA = await getOrCreateATA({
                provider: sdkMut.provider,
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
              await handleTX(
                await wrapTx(initTX.combine(sendTX)),
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
