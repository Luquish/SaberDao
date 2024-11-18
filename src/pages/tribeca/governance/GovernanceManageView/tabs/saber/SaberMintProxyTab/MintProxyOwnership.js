import { useTXHandlers } from "@rockooor/sail";
import { SABER_CODERS } from "@saberhq/saber-periphery";
import { useWallet } from "@solana/wallet-adapter-react";
import invariant from "tiny-invariant";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AddressLink } from "@/common/AddressLink";
import { AsyncButton } from "@/common/AsyncButton";
import { Card } from "@/common/governance/Card";
import { LoadingPage } from "@/common/LoadingPage";
import { ProseSmall } from "@/common/typography/Prose";
import { useMintProxyState } from "./useMintProxyState";
export const MintProxyOwnership = () => {
    const { ownerInvokerKey, buildOwnerInvokeTX, isMemberOfEC, ecWallet } = useExecutiveCouncil();
    const { data: state } = useMintProxyState();
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    const { publicKey } = useWallet();
    if (!ownerInvokerKey || !state) {
        return (React.createElement(Card, { title: "Ownership", padded: true },
            React.createElement(LoadingPage, null)));
    }
    const currentOwner = state.account.owner;
    if (state.account.pendingOwner.equals(ownerInvokerKey)) {
        return (React.createElement(Card, { title: "Accept Ownership", padded: true },
            React.createElement(ProseSmall, null, isMemberOfEC ? (React.createElement(React.Fragment, null,
                React.createElement("p", null, "Accept ownership of the mint proxy on behalf of the Executive Council."),
                React.createElement(AsyncButton, { onClick: async (sdkMut) => {
                        invariant(ownerInvokerKey);
                        const mintProxy = SABER_CODERS.MintProxy.getProgram(sdkMut.provider);
                        const acceptOwnershipTX = await buildOwnerInvokeTX(sdkMut.provider.newTX([
                            mintProxy.state.instruction.acceptOwnership({
                                accounts: {
                                    owner: ownerInvokerKey,
                                },
                            }),
                        ]));
                        await signAndConfirmTX(await wrapTx(acceptOwnershipTX), `Accept Saber Mint Proxy Ownership`);
                    } }, "Accept Ownership"))) : (React.createElement(React.Fragment, null,
                React.createElement("p", null, "Please connect a wallet which is a member of the Executive Council in order to accept ownership."),
                React.createElement("p", null, "Valid accounts:"),
                React.createElement("ul", null, ecWallet.data?.account.owners.map((owner) => (React.createElement("li", { key: owner.toString() },
                    React.createElement(AddressLink, { address: owner, showCopy: true }))))))))));
    }
    // owner invoker is not current owner
    if (!currentOwner.equals(ownerInvokerKey)) {
        const isCurrentOwner = !!publicKey?.equals(currentOwner);
        return (React.createElement(Card, { title: "Transfer Ownership", padded: true },
            React.createElement(ProseSmall, null,
                React.createElement("p", null,
                    "The mint proxy is currently owned by",
                    " ",
                    React.createElement(AddressLink, { address: currentOwner, showCopy: true }),
                    "."),
                isCurrentOwner ? (React.createElement(React.Fragment, null,
                    React.createElement("p", null,
                        "Please transfer its ownership to the owner invoker at",
                        " ",
                        React.createElement(AddressLink, { address: ownerInvokerKey, showCopy: true }),
                        "."),
                    React.createElement(AsyncButton, { onClick: async (sdkMut) => {
                            invariant(ownerInvokerKey);
                            const mintProxy = SABER_CODERS.MintProxy.getProgram(sdkMut.provider);
                            const transferOwnershipTX = sdkMut.provider.newTX([
                                mintProxy.state.instruction.transferOwnership(ownerInvokerKey, {
                                    accounts: {
                                        owner: sdkMut.provider.walletKey,
                                    },
                                }),
                            ]);
                            if (isMemberOfEC) {
                                const acceptOwnershipTX = await buildOwnerInvokeTX(sdkMut.provider.newTX([
                                    mintProxy.state.instruction.acceptOwnership({
                                        accounts: {
                                            owner: ownerInvokerKey,
                                        },
                                    }),
                                ]));
                                await signAndConfirmTX(await wrapTx(transferOwnershipTX.combine(acceptOwnershipTX)), `Transfer and Accept Saber Mint Proxy Ownership`);
                            }
                            else {
                                await signAndConfirmTX(await wrapTx(transferOwnershipTX), `Transfer Saber Mint Proxy Ownership`);
                            }
                        } }, isMemberOfEC
                        ? "Transfer and Accept Ownership"
                        : "Transfer Ownership"))) : (React.createElement("p", null, "Please connect to that address to transfer ownership to the Executive Council's Owner Invoker.")))));
    }
    return React.createElement(React.Fragment, null);
};
