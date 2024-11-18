import { QuarrySDK } from "@quarryprotocol/quarry-sdk";
import { useTXHandlers } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AsyncButton } from "@/common/AsyncButton";
import { Card } from "@/common/governance/Card";
import { InputTokenAmount } from "@/common/inputs/InputTokenAmount";
export const SelfMint = ({ token, minter }) => {
    const [mintAmountRaw, setMintAmountRaw] = useState("");
    const { sdkMut } = useSDK();
    const { wrapTx } = useWrapTx();
    const { signAndConfirmTX } = useTXHandlers();
    const mintAmount = useMemo(() => {
        try {
            return token ? TokenAmount.parse(token, mintAmountRaw) : null;
        }
        catch (e) {
            return null;
        }
    }, [token, mintAmountRaw]);
    if (!sdkMut?.provider.wallet.publicKey.equals(minter.account.minterAuthority)) {
        return (React.createElement(Card, { title: "Self Mint", padded: true },
            React.createElement("p", null, "You are not the minter authority.")));
    }
    return (React.createElement(Card, { title: "Self Mint" },
        React.createElement(InputTokenAmount, { label: "Mint Amount", tokens: [], token: token, inputValue: mintAmountRaw, inputOnChange: setMintAmountRaw }),
        React.createElement(AsyncButton, { disabled: !mintAmount, onClick: async (sdkMut) => {
                invariant(mintAmount, "mint amount");
                const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });
                const performMintTX = await quarrySDK.mintWrapper.performMint({
                    amount: mintAmount,
                    minter: {
                        accountId: minter.publicKey,
                        accountInfo: {
                            data: minter.account,
                        },
                    },
                });
                await signAndConfirmTX(await wrapTx(performMintTX), `Mint ${mintAmount.formatUnits()} to self`);
            } }, "Self Mint")));
};
