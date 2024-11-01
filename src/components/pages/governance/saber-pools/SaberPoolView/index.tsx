import { SmartWalletWrapper } from "@gokiprotocol/client";
import { QuarrySDK } from "@quarryprotocol/quarry-sdk";
import type { ProgramAccountParser } from "@rockooor/sail";
import { useParsedAccount, useToken, useTXHandlers } from "@rockooor/sail";
import { PoolManagerSDK } from "@saberhq/pool-manager";
import type { StableSwapState } from "@saberhq/stableswap-sdk";
import { decodeSwap, SWAP_PROGRAM_ID } from "@saberhq/stableswap-sdk";
import { Percent } from "@saberhq/token-utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSaberSwaps } from "../../../../../hooks/saber/useSaberSwaps";
import { useExecutiveCouncil } from "../../../../../hooks/tribeca/useExecutiveCouncil";
import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../common/AsyncButton";
import { AttributeList } from "../../../../common/AttributeList";
import { EmptyStateConnectWallet } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { RampA } from "./RampA";

const SWAP_PARSER: ProgramAccountParser<StableSwapState> = {
  programID: SWAP_PROGRAM_ID,
  name: "StableSwap",
  parse: decodeSwap,
};

const SABER_OPERATOR = new PublicKey(
  "GdW7Accmjusk8qKUPoCMJasEje63h97igqkjdEpacpRN"
);

export const SABER_POOL_MANAGER = new PublicKey(
  "XD5s9eMuSibXzczBysd8VmG6nVe7DjqMQK1iZMQjANd"
);

const SWAP_FEE_AMOUNTS = [
  new Percent(1, 1_000_000_000),
  new Percent(1, 100_000),
  new Percent(15, 1_000_000),
  new Percent(5, 100_000),
  new Percent(1, 10_000),
  new Percent(4, 10_000),
];

export const SaberPoolView: React.FC = () => {
  const { data: swaps } = useSaberSwaps();
  const { poolID } = useParams<{ poolID: string }>();
  const { ecWallet } = useExecutiveCouncil();

  const swap = swaps?.find((s) => s.id === poolID);
  const { path } = useGovernor();
  const { data: lpToken } = useToken(swap?.addresses.lpTokenMint);
  const { data: swapInfo } = useParsedAccount(
    swap?.addresses.swapAccount,
    SWAP_PARSER
  );
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  const wallet = useAnchorWallet();

  useGovWindowTitle(`Update Fees`);
  return (
    <GovernancePage
      title={`Pool: ${swap?.id ?? "loading..."}`}
      backLink={{
        label: "Overview",
        href: path,
      }}
    >
      {swap && (
        <div tw="flex flex-col gap-8">
          <Card title="Overview">
            <AttributeList
              attributes={{
                ID: swap.id,
                "LP Token": lpToken,
                "Swap Fee": swapInfo?.account.fees.trade,
                "Withdraw Fee": swapInfo?.account.fees.withdraw,
                "Admin Swap Fee": swapInfo?.account.fees.adminTrade,
                "Admin Withdraw Fee": swapInfo?.account.fees.adminWithdraw,
              }}
            />
          </Card>
          <Card title="Quarry" padded>
            <AsyncButton
              onClick={async (sdk) => {
                const quarry = QuarrySDK.load({ provider: sdk.provider });
                const operatorW = await quarry.loadOperator(SABER_OPERATOR);
                invariant(operatorW && lpToken);
                const { tx } = await operatorW.delegateCreateQuarry({
                  tokenMint: lpToken.mintAccount,
                });
                await signAndConfirmTX(await wrapTx(tx), "Create Quarry");
              }}
            >
              Create Quarry
            </AsyncButton>
          </Card>
          <Card title="Set Fees" padded>
            {!wallet && <EmptyStateConnectWallet />}
            {wallet && (
              <div tw="flex gap-2">
                {SWAP_FEE_AMOUNTS.map((fee, i) => {
                  return (
                    <AsyncButton
                      key={i}
                      onClick={async (sdkMut) => {
                        const ecPublicKey = ecWallet.data?.publicKey;
                        invariant(
                          ecPublicKey && swapInfo,
                          "swap info or ec public key not found"
                        );
                        const smartWallet = await SmartWalletWrapper.load(
                          sdkMut,
                          ecPublicKey
                        );
                        const poolManagerSDK = PoolManagerSDK.load({
                          provider: sdkMut.provider,
                        });
                        const poolManager = await poolManagerSDK.loadManager(
                          SABER_POOL_MANAGER
                        );
                        const poolWrapper = await poolManager.loadPoolWrapper(
                          swap.addresses.admin
                        );
                        const setFeesTX = poolWrapper.setNewFees({
                          ...swapInfo.account.fees,
                          trade: fee,
                        });
                        const setFeesIX = setFeesTX.instructions[0];
                        invariant(setFeesIX);
                        const invokeTX =
                          await smartWallet.ownerInvokeInstructionV2({
                            instruction: setFeesIX,
                            index: 0,
                          });
                        await signAndConfirmTX(
                          await wrapTx(invokeTX),
                          `Set swap fee to ${fee.toSignificant()}%`
                        );
                      }}
                    >
                      Set Swap Fees to {fee.toSignificant()}%
                    </AsyncButton>
                  );
                })}
              </div>
            )}
          </Card>
          {swapInfo && <RampA swap={swap} swapInfo={swapInfo} />}
        </div>
      )}
    </GovernancePage>
  );
};

export default SaberPoolView;
