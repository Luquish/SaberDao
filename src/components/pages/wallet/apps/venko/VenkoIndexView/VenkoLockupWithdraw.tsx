import {
  TOKEN_ACCOUNT_PARSER,
  useParsedAccountData,
  usePubkey,
  useSail,
  useToken,
  useUserATAs,
} from "@rockooor/sail";
import { getATAAddress, TokenAmount, u64 } from "@saberhq/token-utils";
import { useQuery } from "@tanstack/react-query";
import type { StreamData } from "@venkoapp/venko";
import { findStreamAddress, VenkoSDK } from "@venkoapp/venko";
import BN from "bn.js";
import { useState } from "react";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";

import { useProvider } from "../../../../../../hooks/useProvider";
import { useSmartWallet } from "../../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../../hooks/useWrapTx";
import { notify } from "../../../../../../utils/notifications";
import { useParsedStream } from "../../../../../../utils/parsers";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { AttributeList } from "../../../../../common/AttributeList";
import { Button } from "../../../../../common/Button";
import { InputText } from "../../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../../common/inputs/LabeledInput";

/**
 * Computes the amount of tokens that may be redeemed on a Stream.
 * @param stream
 * @returns
 */
const computeRedeemableAmount = (stream: StreamData): u64 => {
  const nowTs = new u64(Math.floor(new Date().getTime() / 1_000));
  const startTs = stream.startTs;
  const cliffTs = stream.cliffTs;
  const endTs = stream.endTs;
  if (nowTs.lt(cliffTs) || nowTs.lt(startTs)) {
    return new u64(0);
  }
  if (nowTs.gte(endTs)) {
    return stream.initialAmount.sub(stream.redeemedAmount);
  }
  const max = nowTs
    .sub(startTs)
    .mul(stream.initialAmount)
    .div(endTs.sub(startTs));
  return new u64(max.sub(stream.redeemedAmount));
};

export const VenkoLockupInner: React.FC = () => {
  const navigate = useNavigate();
  const { providerMut } = useProvider();
  const { smartWallet, key: smartWalletKey, path } = useSmartWallet();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const [mintStr, setMintStr] = useState<string>("");
  const mintKey = usePubkey(mintStr);
  const { data: streamToken } = useToken(mintKey);
  const [userStreamTokens] = useUserATAs(streamToken);
  const { data: walletStreamATA } = useQuery({
    queryKey: ["streamATA", streamToken?.address],
    queryFn: async () => {
      invariant(streamToken);
      return await getATAAddress({
        mint: streamToken.mintAccount,
        owner: smartWalletKey,
      });
    },
    enabled: !!streamToken,
  });
  const { data: walletTokens } = useParsedAccountData(
    walletStreamATA,
    TOKEN_ACCOUNT_PARSER
  );

  const hasSmartWalletBalance = walletTokens?.accountInfo.data.amount.gt(
    new BN(0)
  );
  const hasStreamBalance = userStreamTokens?.balance.greaterThan(0);
  const { data: streamKey } = useQuery({
    queryKey: ["streamKey", streamToken?.address],
    queryFn: async () => {
      invariant(streamToken);
      const [streamKey] = await findStreamAddress(streamToken.mintAccount);
      return streamKey;
    },
    enabled: !!streamToken,
  });
  const { data: stream } = useParsedStream(streamKey);

  const withdrawSmartWallet = async () => {
    invariant(smartWallet && stream && streamToken);
    const { venko } = VenkoSDK.load({ provider: smartWallet.provider });

    const redeemableAmount = new TokenAmount(
      streamToken,
      computeRedeemableAmount(stream.accountInfo.data)
    );
    notify({
      message: `Redeeming ${redeemableAmount.formatUnits()}`,
    });
    const redeemTX = await venko.redeem({
      amount: redeemableAmount,
      owner: smartWalletKey,
      recipient: smartWallet.provider.wallet.publicKey,
    });
    const { tx: newTX, index } = await smartWallet.newTransactionFromEnvelope({
      tx: redeemTX,
    });
    const { pending, success } = await handleTX(
      await wrapTx(newTX),
      "Propose: Redeem Tokens"
    );
    if (!pending || !success) {
      return;
    }
    await pending.wait();
    navigate(`${path}/tx/${index}`);
  };

  const withdraw = async () => {
    invariant(providerMut && stream && streamToken);
    const { venko } = VenkoSDK.load({ provider: providerMut });

    const redeemableAmount = new TokenAmount(
      streamToken,
      computeRedeemableAmount(stream.accountInfo.data)
    );
    notify({
      message: `Redeeming ${redeemableAmount.formatUnits()}`,
    });
    const redeemTX = await venko.redeem({
      amount: redeemableAmount,
    });
    const { pending, success } = await handleTX(
      await wrapTx(redeemTX),
      "Redeem Tokens"
    );
    if (!pending || !success) {
      return;
    }
    await pending.wait();
  };

  return (
    <div tw="flex flex-col gap-4">
      <LabeledInput
        Component={InputText}
        label="Stream Mint"
        type="text"
        placeholder="Mint address of your Stream token."
        value={mintStr}
        onChange={(e) => {
          setMintStr(e.target.value);
        }}
      />
      {stream && streamToken && (
        <div>
          <AttributeList
            attributes={{
              Stream: stream.accountId,
              Mint: stream.accountInfo.data.mint,
              Start: new Date(
                stream.accountInfo.data.startTs.toNumber() * 1_000
              ),
              Cliff: new Date(
                stream.accountInfo.data.cliffTs.toNumber() * 1_000
              ),
              End: new Date(stream.accountInfo.data.endTs.toNumber() * 1_000),
              "Initial Amount": new TokenAmount(
                streamToken,
                stream.accountInfo.data.initialAmount
              ),
              "Redeemed Amount": new TokenAmount(
                streamToken,
                stream.accountInfo.data.redeemedAmount
              ),
              "Redeemable Amount": new TokenAmount(
                streamToken,
                computeRedeemableAmount(stream.accountInfo.data)
              ),
            }}
          />
          {smartWallet && walletTokens && (
            <div>
              <p>
                Smart Wallet Balance:{" "}
                {new TokenAmount(
                  streamToken,
                  walletTokens.accountInfo.data.amount
                ).formatUnits()}
              </p>
              <Button
                disabled={!hasSmartWalletBalance}
                variant="primary"
                onClick={async () => {
                  await withdrawSmartWallet();
                }}
              >
                Withdraw Smart Wallet
              </Button>
            </div>
          )}
          {hasStreamBalance && userStreamTokens && (
            <div>
              <p>Your balance: {userStreamTokens.balance.formatUnits()}</p>
              <AsyncButton
                variant="primary"
                onClick={async () => {
                  await withdraw();
                }}
              >
                Withdraw All
              </AsyncButton>
            </div>
          )}
          {!hasStreamBalance && !hasSmartWalletBalance && (
            <div>
              You don't have any stream tokens. Make sure you're on the correct
              Smart Wallet or connected to the right wallet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
