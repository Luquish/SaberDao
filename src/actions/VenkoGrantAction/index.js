import { findMinterAddress, QUARRY_CODERS } from "@quarryprotocol/quarry-sdk";
import { TOKEN_ACCOUNT_PARSER, useAccountData, useParsedAccountData, usePubkey, useSail, useToken, } from "@rockooor/sail";
import { RedeemerWrapper, Saber, SABER_ADDRESSES, } from "@saberhq/saber-periphery";
import { buildStubbedTransaction, PublicKey } from "@saberhq/solana-contrib";
import { getATAAddress, getOrCreateATA, SPLToken, TOKEN_PROGRAM_ID, } from "@saberhq/token-utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { AsyncButton } from "../../components/tribeca/common/AsyncButton";
import { InputText } from "../../components/tribeca/common/inputs/InputText";
import { InputTokenAmount } from "../../components/tribeca/common/inputs/InputTokenAmount";
import { useGovernor } from "../../hooks/tribeca/useGovernor";
import { useParseTokenAmount } from "../../hooks/tribeca/useParseTokenAmount";
import { useProvider } from "../../hooks/tribeca/useProvider";
import { useWrapTx } from "../../hooks/tribeca/useWrapTx";
import { serializeToBase64 } from "../../utils/tribeca/makeTransaction";
import { useParsedMintWrapper } from "../../utils/tribeca/parsers";
import { GrantVenkoStreamForm } from "./GrantVenkoStreamForm";
import React from "react";
export const VenkoGrantAction = ({ actor, ctx, setError, setTxRaw, }) => {
    const { govToken } = useGovernor();
    const [amountStr, setAmountStr] = useState("");
    const [destinationStr, setDestinationStr] = useState("");
    const { network, providerMut } = useProvider();
    const amount = useParseTokenAmount(govToken, amountStr);
    const recipient = usePubkey(destinationStr);
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const minter = ctx?.minter;
    const mintWrapper = useMemo(() => (minter ? minter.mintWrapper : null), [minter]);
    const { data: mintWrapperData } = useParsedMintWrapper(mintWrapper);
    const redeemer = useMemo(() => (minter?.redeemer ? new PublicKey(minter.redeemer) : null), [minter?.redeemer]);
    const { data: redeemerData } = useAccountData(redeemer);
    const { data: grantToken } = useToken(mintWrapperData?.accountInfo.data.tokenMint);
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
    const { data: recipientATA } = useParsedAccountData(recipientATAKey, TOKEN_ACCOUNT_PARSER);
    useEffect(() => {
        if (!providerMut ||
            !mintWrapper ||
            !actor ||
            !amount ||
            !recipient ||
            !mintWrapperData ||
            (redeemer && !redeemerData) ||
            !govToken) {
            return;
        }
        void (async () => {
            const [minter] = await findMinterAddress(mintWrapper, actor);
            const ixs = [];
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
            const mintIX = QUARRY_CODERS.MintWrapper.encodeIX("performMint", { amount: amount.toU64() }, {
                mintWrapper,
                minterAuthority: actor,
                destination: mintDestination,
                minter,
                tokenMint: mintWrapperData.accountInfo.data.tokenMint,
                tokenProgram: TOKEN_PROGRAM_ID,
            });
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
                    ixs.push(SPLToken.createTransferInstruction(TOKEN_PROGRAM_ID, smartWalletUnderlyingATA, underlyingATA, actor, [], amount.toU64()));
                }
            }
            try {
                const txStub = buildStubbedTransaction(network !== "localnet" ? network : "devnet", ixs);
                setTxRaw(serializeToBase64(txStub));
                setError(null);
            }
            catch (ex) {
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
    return (React.createElement(React.Fragment, null,
        grantToken && React.createElement(GrantVenkoStreamForm, { actor: actor, token: grantToken }),
        React.createElement(InputTokenAmount, { label: "Amount", token: govToken ?? null, tokens: [], className: "h-auto", inputValue: amountStr, inputDisabled: !actor, inputOnChange: (e) => {
                setAmountStr(e);
            } }),
        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "destination" },
            React.createElement("span", { className: "text-sm" }, "Recipient"),
            React.createElement(InputText, { id: "destination", placeholder: "Address to give tokens to.", value: destinationStr, onChange: (e) => {
                    setDestinationStr(e.target.value);
                } })),
        recipientATAKey && recipientATA === null && (React.createElement(AsyncButton, { disabled: !mintWrapperData || !actor || !grantToken, onClick: async (sdkMut) => {
                invariant(mintWrapperData && actor && grantToken);
                const ixs = [];
                const { instruction: createMintWrapperATAIX } = await getOrCreateATA({
                    provider: sdkMut.provider,
                    mint: mintWrapperData.accountInfo.data.tokenMint,
                    owner: actor,
                });
                ixs.push(createMintWrapperATAIX);
                if (!grantToken.mintAccount.equals(mintWrapperData.accountInfo.data.tokenMint)) {
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
                const { pending, success } = await handleTX(await wrapTx(sdkMut.provider.newTX(ixs)), "Create token accounts");
                if (!success || !pending) {
                    return;
                }
                await pending.wait();
            } }, "Create token accounts"))));
};
