import { useState } from "react";
import { ACTIONS } from "@/actions/types";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { HelperCard } from "../../../../../common/HelperCard";
import { Select } from "@/components/tribeca/common/inputs/InputText";
import { LoadingPage } from "../../../../../common/LoadingPage";
export const ProposalTXForm = ({ setError, txRaw, setTxRaw, }) => {
    const [actionType, setActionType] = useState("Upgrade Program");
    const { meta, smartWallet, lockerData, governor } = useGovernor();
    const { ownerInvokerKey } = useExecutiveCouncil();
    if (!smartWallet || !ownerInvokerKey) {
        return React.createElement(LoadingPage, null);
    }
    const actor = smartWallet;
    const ctx = { ...meta, locker: lockerData?.publicKey, governor };
    const currentAction = ACTIONS.find((action) => action.title === actionType);
    return (React.createElement("div", { tw: "grid gap-4" },
        React.createElement("label", { tw: "flex flex-col gap-1", htmlFor: "proposedAction" },
            React.createElement("span", { tw: "text-sm" }, "Proposed Action"),
            React.createElement(Select, { value: actionType, onChange: (e) => {
                    setActionType(e.target.value);
                    setError(null);
                    setTxRaw("");
                } }, ACTIONS.map(({ title, isEnabled }) => {
                if (isEnabled && ctx && !isEnabled(ctx)) {
                    return null;
                }
                return (React.createElement("option", { key: title, value: title }, title));
            }))),
        currentAction && (React.createElement(React.Fragment, null,
            currentAction.description && (React.createElement(HelperCard, null, currentAction.description)),
            React.createElement(currentAction.Renderer, { actor: actor, payer: ownerInvokerKey, ctx: ctx, txRaw: txRaw, setError: setError, setTxRaw: setTxRaw })))));
};
