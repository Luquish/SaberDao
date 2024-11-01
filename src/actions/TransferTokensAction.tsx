import {
  usePubkey,
  useTokenAccount,
  useTokenAmount,
  useTXHandlers,
} from "@rockooor/sail";
import { buildStubbedTransaction, mapN } from "@saberhq/solana-contrib";
import type { Token } from "@saberhq/token-utils";
import {
  createATAInstruction,
  getATAAddressSync,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import type { TransactionInstruction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";

import { AsyncButton } from "../components/common/AsyncButton";
import { InputText } from "../components/common/inputs/InputText";
import { InputTokenAmount } from "../components/common/inputs/InputTokenAmount";
import { useTokenAccounts } from "../hooks/useTokenAccounts";
import { useWrapTx } from "../hooks/useWrapTx";
import { serializeToBase64 } from "../utils/makeTransaction";
import { useEnvironment } from "../utils/useEnvironment";
import type { ActionFormProps } from "./types";

export const TransferTokensAction: React.FC<ActionFormProps> = ({
  actor,
  setError,
  setTxRaw,
}: ActionFormProps) => {
  const [token, setToken] = useState<Token | null>(null);
  const [amountStr, setAmountStr] = useState<string>("");
  const [destinationStr, setDestinationStr] = useState<string>("");

  const { network } = useEnvironment();
  const amount = useTokenAmount(token, amountStr);
  const recipient = usePubkey(destinationStr);

  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  const treasuryATAKey = mapN(
    (token) => getATAAddressSync({ mint: token?.mintAccount, owner: actor }),
    token
  );
  const recipientATAKey = mapN(
    (token, recipient) =>
      getATAAddressSync({ mint: token?.mintAccount, owner: recipient }),
    token,
    recipient
  );
  const { data: treasuryATA } = useTokenAccount(treasuryATAKey);
  const { data: recipientATA } = useTokenAccount(recipientATAKey);

  const { data: treasuryTokenAccounts } = useTokenAccounts(actor);
  const allTokens =
    treasuryTokenAccounts
      ?.map((ta) => ta?.balance.token)
      .filter((t): t is Token => !!t) ?? [];

  const selectedAccount = token
    ? treasuryTokenAccounts?.find((t) => t?.balance.token.equals(token))
    : null;

  useEffect(() => {
    if (!treasuryATA || !recipientATA || !actor || !amount) {
      return;
    }
    const ixs: TransactionInstruction[] = [
      SPLToken.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        treasuryATA.publicKey,
        recipientATA.publicKey,
        actor,
        [],
        amount.toU64()
      ),
    ];

    try {
      const txStub = buildStubbedTransaction(
        network !== "localnet" ? network : "devnet",
        ixs
      );
      setTxRaw(serializeToBase64(txStub));
      setError(null);
    } catch (ex) {
      setTxRaw("");
      console.debug("Error issuing tokens", ex);
      setError("Error generating proposal");
    }
  }, [actor, amount, network, recipientATA, setError, setTxRaw, treasuryATA]);

  return (
    <>
      <InputTokenAmount
        label="Amount"
        token={token}
        onTokenSelect={setToken}
        tokens={allTokens}
        tw="h-auto"
        inputValue={amountStr}
        inputDisabled={!actor}
        inputOnChange={(e) => {
          setAmountStr(e);
        }}
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
      <label tw="flex flex-col gap-1" htmlFor="source">
        <span tw="text-sm">Sender</span>
        <InputText id="source" value={actor.toString()} disabled />
      </label>
      <label tw="flex flex-col gap-1" htmlFor="destination">
        <span tw="text-sm">Recipient</span>
        <InputText
          id="destination"
          placeholder="Address to give tokens to."
          value={destinationStr}
          onChange={(e) => {
            setDestinationStr(e.target.value);
          }}
        />
      </label>
      {recipientATA === null && recipientATAKey && (
        <AsyncButton
          disabled={!actor || !token || !recipient || !recipientATAKey}
          onClick={async (sdkMut) => {
            invariant(actor && token && recipient && recipientATAKey);
            await signAndConfirmTX(
              await wrapTx(
                sdkMut.provider.newTX([
                  createATAInstruction({
                    address: recipientATAKey,
                    mint: token.mintAccount,
                    owner: recipient,
                    payer: sdkMut.provider.walletKey,
                  }),
                ])
              ),
              "Create token accounts"
            );
          }}
        >
          Create token accounts
        </AsyncButton>
      )}
    </>
  );
};
