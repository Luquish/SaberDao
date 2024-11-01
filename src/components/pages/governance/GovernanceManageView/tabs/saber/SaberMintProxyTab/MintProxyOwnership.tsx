import { useTXHandlers } from "@rockooor/sail";
import { SABER_CODERS } from "@saberhq/saber-periphery";
import { useWallet } from "@solana/wallet-adapter-react";
import invariant from "tiny-invariant";

import { useExecutiveCouncil } from "../../../../../../../hooks/tribeca/useExecutiveCouncil";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AddressLink } from "../../../../../../common/AddressLink";
import { AsyncButton } from "../../../../../../common/AsyncButton";
import { Card } from "../../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../../common/LoadingPage";
import { ProseSmall } from "../../../../../../common/typography/Prose";
import { useMintProxyState } from "./useMintProxyState";

export const MintProxyOwnership: React.FC = () => {
  const { ownerInvokerKey, buildOwnerInvokeTX, isMemberOfEC, ecWallet } =
    useExecutiveCouncil();
  const { data: state } = useMintProxyState();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  const { publicKey } = useWallet();

  if (!ownerInvokerKey || !state) {
    return (
      <Card title="Ownership" padded>
        <LoadingPage />
      </Card>
    );
  }

  const currentOwner = state.account.owner;

  if (state.account.pendingOwner.equals(ownerInvokerKey)) {
    return (
      <Card title="Accept Ownership" padded>
        <ProseSmall>
          {isMemberOfEC ? (
            <>
              <p>
                Accept ownership of the mint proxy on behalf of the Executive
                Council.
              </p>
              <AsyncButton
                onClick={async (sdkMut) => {
                  invariant(ownerInvokerKey);
                  const mintProxy = SABER_CODERS.MintProxy.getProgram(
                    sdkMut.provider
                  );
                  const acceptOwnershipTX = await buildOwnerInvokeTX(
                    sdkMut.provider.newTX([
                      mintProxy.state.instruction.acceptOwnership({
                        accounts: {
                          owner: ownerInvokerKey,
                        },
                      }),
                    ])
                  );
                  await signAndConfirmTX(
                    await wrapTx(acceptOwnershipTX),
                    `Accept Saber Mint Proxy Ownership`
                  );
                }}
              >
                Accept Ownership
              </AsyncButton>
            </>
          ) : (
            <>
              <p>
                Please connect a wallet which is a member of the Executive
                Council in order to accept ownership.
              </p>
              <p>Valid accounts:</p>
              <ul>
                {ecWallet.data?.account.owners.map((owner) => (
                  <li key={owner.toString()}>
                    <AddressLink address={owner} showCopy />
                  </li>
                ))}
              </ul>
            </>
          )}
        </ProseSmall>
      </Card>
    );
  }

  // owner invoker is not current owner
  if (!currentOwner.equals(ownerInvokerKey)) {
    const isCurrentOwner = !!publicKey?.equals(currentOwner);
    return (
      <Card title="Transfer Ownership" padded>
        <ProseSmall>
          <p>
            The mint proxy is currently owned by{" "}
            <AddressLink address={currentOwner} showCopy />.
          </p>
          {isCurrentOwner ? (
            <>
              <p>
                Please transfer its ownership to the owner invoker at{" "}
                <AddressLink address={ownerInvokerKey} showCopy />.
              </p>
              <AsyncButton
                onClick={async (sdkMut) => {
                  invariant(ownerInvokerKey);
                  const mintProxy = SABER_CODERS.MintProxy.getProgram(
                    sdkMut.provider
                  );
                  const transferOwnershipTX = sdkMut.provider.newTX([
                    mintProxy.state.instruction.transferOwnership(
                      ownerInvokerKey,
                      {
                        accounts: {
                          owner: sdkMut.provider.walletKey,
                        },
                      }
                    ),
                  ]);
                  if (isMemberOfEC) {
                    const acceptOwnershipTX = await buildOwnerInvokeTX(
                      sdkMut.provider.newTX([
                        mintProxy.state.instruction.acceptOwnership({
                          accounts: {
                            owner: ownerInvokerKey,
                          },
                        }),
                      ])
                    );
                    await signAndConfirmTX(
                      await wrapTx(
                        transferOwnershipTX.combine(acceptOwnershipTX)
                      ),
                      `Transfer and Accept Saber Mint Proxy Ownership`
                    );
                  } else {
                    await signAndConfirmTX(
                      await wrapTx(transferOwnershipTX),
                      `Transfer Saber Mint Proxy Ownership`
                    );
                  }
                }}
              >
                {isMemberOfEC
                  ? "Transfer and Accept Ownership"
                  : "Transfer Ownership"}
              </AsyncButton>
            </>
          ) : (
            <p>
              Please connect to that address to transfer ownership to the
              Executive Council's Owner Invoker.
            </p>
          )}
        </ProseSmall>
      </Card>
    );
  }

  return <></>;
};
