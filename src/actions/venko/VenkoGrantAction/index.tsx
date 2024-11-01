import { findMinterAddress, QUARRY_CODERS } from "@quarryprotocol/quarry-sdk";
import {
  TOKEN_ACCOUNT_PARSER,
  useAccountData,
  useParsedAccountData,
  usePubkey,
  useSail,
  useToken,
} from "@rockooor/sail";
import {
  RedeemerWrapper,
  Saber,
  SABER_ADDRESSES,
} from "@saberhq/saber-periphery";
import { buildStubbedTransaction, PublicKey } from "@saberhq/solana-contrib";
import {
  getATAAddress,
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import type { TransactionInstruction } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";

import { AsyncButton } from "../../../components/common/AsyncButton";
import { InputText } from "../../../components/common/inputs/InputText";
import { InputTokenAmount } from "../../../components/common/inputs/InputTokenAmount";
import { useGovernor } from "../../../hooks/tribeca/useGovernor";
import { useParseTokenAmount } from "../../../hooks/useParseTokenAmount";
import { useProvider } from "../../../hooks/useProvider";
import { useWrapTx } from "../../../hooks/useWrapTx";
import { serializeToBase64 } from "../../../utils/makeTransaction";
import { useParsedMintWrapper } from "../../../utils/parsers";
import type { ActionFormProps } from "../../types";
import { GrantVenkoStreamForm } from "./GrantVenkoStreamForm";

export const VenkoGrantAction: React.FC<ActionFormProps> = ({
  actor,
  ctx,
  setError,
  setTxRaw,
}: ActionFormProps) => {
  const { govToken } = useGovernor();
  const [amountStr, setAmountStr] = useState<string>("");
  const [destinationStr, setDestinationStr] = useState<string>("");
  const { network, providerMut } = useProvider();
  const amount = useParseTokenAmount(govToken, amountStr);
  const recipient = usePubkey(destinationStr);
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  const minter = ctx?.minter;
  const mintWrapper = useMemo(
    () => (minter ? minter.mintWrapper : null),
    [minter]
  );
  const { data: mintWrapperData } = useParsedMintWrapper(mintWrapper);
  const redeemer = useMemo(
    () => (minter?.redeemer ? new PublicKey(minter.redeemer) : null),
    [minter?.redeemer]
  );
  const { data: redeemerData } = useAccountData(redeemer);

  const { data: grantToken } = useToken(
    mintWrapperData?.accountInfo.data.tokenMint
  );

  const { data: recipientATAKey } = useQuery({
    queryKey: ["ata", grantToken?.address, recipient?.toString()],
    queryFn: async () => {
      invariant(grantToken && recipient);
      return await getATAAddress({
        mint: grantToken.mintAccount,
        owner: recipient,
      });
    },
    enabled: !!grantToken && !!recipient,
  });
  const { data: recipientATA } = useParsedAccountData(
    recipientATAKey,
    TOKEN_ACCOUNT_PARSER
  );

  useEffect(() => {
    if (
      !providerMut ||
      !mintWrapper ||
      !actor ||
      !amount ||
      !recipient ||
      !mintWrapperData ||
      (redeemer && !redeemerData) ||
      !govToken
    ) {
      return;
    }
    void (async () => {
      const [minter] = await findMinterAddress(mintWrapper, actor);

      const ixs: TransactionInstruction[] = [];

      const smartWalletMintTokens = await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: actor,
      });
      const destinationATA = await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: recipient,
      });

      const mintDestination = redeemerData
        ? smartWalletMintTokens
        : destinationATA;

      const mintIX = QUARRY_CODERS.MintWrapper.encodeIX(
        "performMint",
        { amount: amount.toU64() },
        {
          mintWrapper,
          minterAuthority: actor,
          destination: mintDestination,
          minter,
          tokenMint: mintWrapperData.accountInfo.data.tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      );
      ixs.push(mintIX);

      if (redeemerData) {
        if (redeemerData.accountInfo.owner.equals(SABER_ADDRESSES.Redeemer)) {
          // handle mint proxy redemption
          const redeemerW = await RedeemerWrapper.load({
            sdk: Saber.load({ provider: providerMut }),
            iouMint: mintWrapperData.accountInfo.data.tokenMint,
            redemptionMint: govToken.mintAccount,
          });

          const smartWalletUnderlyingATA = await getATAAddress({
            mint: govToken.mintAccount,
            owner: actor,
          });
          const underlyingATA = await getATAAddress({
            mint: govToken.mintAccount,
            owner: recipient,
          });

          const redeemIX = await redeemerW.redeemTokensFromMintProxyIx({
            tokenAmount: amount.toU64(),
            sourceAuthority: actor,
            iouSource: mintDestination,
            redemptionDestination: smartWalletUnderlyingATA,
          });
          ixs.push(redeemIX);

          ixs.push(
            SPLToken.createTransferInstruction(
              TOKEN_PROGRAM_ID,
              smartWalletUnderlyingATA,
              underlyingATA,
              actor,
              [],
              amount.toU64()
            )
          );
        }
      }

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
    })();
  }, [
    amount,
    recipient,
    govToken,
    mintWrapper,
    mintWrapperData,
    network,
    providerMut,
    redeemer,
    redeemerData,
    setError,
    setTxRaw,
    actor,
  ]);

  return (
    <>
      {grantToken && <GrantVenkoStreamForm actor={actor} token={grantToken} />}
      <InputTokenAmount
        label="Amount"
        token={govToken ?? null}
        tokens={[]}
        tw="h-auto"
        inputValue={amountStr}
        inputDisabled={!actor}
        inputOnChange={(e) => {
          setAmountStr(e);
        }}
      />
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
      {recipientATAKey && recipientATA === null && (
        <AsyncButton
          disabled={!mintWrapperData || !actor || !grantToken}
          onClick={async (sdkMut) => {
            invariant(mintWrapperData && actor && grantToken);
            const ixs: (TransactionInstruction | null)[] = [];
            const { instruction: createMintWrapperATAIX } =
              await getOrCreateATA({
                provider: sdkMut.provider,
                mint: mintWrapperData.accountInfo.data.tokenMint,
                owner: actor,
              });
            ixs.push(createMintWrapperATAIX);

            if (
              !grantToken.mintAccount.equals(
                mintWrapperData.accountInfo.data.tokenMint
              )
            ) {
              const { instruction: createRedeemATAIX } = await getOrCreateATA({
                provider: sdkMut.provider,
                mint: grantToken.mintAccount,
                owner: actor,
              });
              ixs.push(createRedeemATAIX);
            }
            if (recipient) {
              const { instruction: recipientATA } = await getOrCreateATA({
                provider: sdkMut.provider,
                mint: grantToken.mintAccount,
                owner: recipient,
              });
              ixs.push(recipientATA);
            }
            const { pending, success } = await handleTX(
              await wrapTx(sdkMut.provider.newTX(ixs)),
              "Create token accounts"
            );
            if (!success || !pending) {
              return;
            }
            await pending.wait();
          }}
        >
          Create token accounts
        </AsyncButton>
      )}
    </>
  );
};
