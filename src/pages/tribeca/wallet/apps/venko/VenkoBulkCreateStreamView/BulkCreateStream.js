import { usePubkey, useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/tribeca/common/inputs/InputText";
import { LabeledInput } from "../../../../../common/inputs/LabeledInput";
import { ModalButton } from "../../../../../common/Modal/ModalButton";
import { Section } from "../../../../../layout/WalletLayout/Section";
import { BulkStreamConfigRenderer } from "./BulkStreamConfigRenderer";
import { BulkStreamModalInner } from "./BulkStreamModalInner";
export const BulkCreateStream = () => {
    const [configStr, setConfigStr] = useState("");
    const configRaw = useMemo(() => {
        try {
            return JSON.parse(configStr);
        }
        catch (e) {
            return null;
        }
    }, [configStr]);
    const { data: token } = useToken(usePubkey(configRaw?.token_mint));
    const config = useMemo(() => {
        if (!token || !configRaw) {
            return null;
        }
        const start = new Date(configRaw.start * 1_000);
        const end = new Date((configRaw.start + configRaw.duration) * 1_000);
        return {
            start,
            end,
            recipients: Object.entries(configRaw.recipients).map(([name, { amount, address }]) => ({
                name,
                amount: TokenAmount.parse(token, amount.replace(/,/g, "")),
                address: new PublicKey(address),
            })),
            revocable: configRaw.revocable,
            token,
        };
    }, [configRaw, token]);
    return (React.createElement("div", null,
        React.createElement(Section, { title: "Bulk Create Streams", description: "Create Streams from a JSON spec." },
            React.createElement("div", { tw: "flex flex-col gap-4" },
                React.createElement(LabeledInput, { id: "config", Component: Textarea, label: "Configuration JSON", value: configStr, onChange: (e) => setConfigStr(e.target.value) }),
                config && (React.createElement(React.Fragment, null,
                    React.createElement(BulkStreamConfigRenderer, { config: config }),
                    React.createElement(ModalButton, { buttonLabel: "Create Streams", buttonProps: { variant: "primary" } }, config && React.createElement(BulkStreamModalInner, { config: config }))))))));
};
