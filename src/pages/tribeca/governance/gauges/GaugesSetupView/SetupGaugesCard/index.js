import { usePubkey } from "@rockooor/sail";
import { useState } from "react";
import React from 'react';
import { useParsedOperator, useParsedRewarder, } from "@/utils/tribeca/parsers";
import { Card } from "@/components/tribeca/common/governance/Card";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { CreateGaugemeisterModal } from "./CreateGaugemeisterModal";
export const SetupGaugesCard = () => {
    const [rewarderKeyStr, setRewarderKeyStr] = useState("");
    const rewarderKey = usePubkey(rewarderKeyStr);
    const [startTime, setStartTime] = useState(new Date().toISOString().split("Z")[0] ?? "");
    const { data: rewarder } = useParsedRewarder(rewarderKey);
    const { data: operator } = useParsedOperator(rewarder?.accountInfo.data.authority);
    const disabledReason = !rewarder
        ? "Rewarder does not exist"
        : !operator
            ? "Must be operator"
            : null;
    return (React.createElement(Card, { title: "Setup Gauges" },
        React.createElement("div", { className: "px-7 py-4 text-sm" },
            React.createElement("p", { className: "mb-4" }, "Gauges allow DAO members to vote on where they want liquidity mining rewards to exist."),
            React.createElement("form", { className: "flex flex-col gap-4", onSubmit: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                } },
                React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "rewarderKey" },
                    React.createElement("span", { className: "text-sm" }, "Rewarder Key"),
                    React.createElement(InputText, { id: "rewarderKey", type: "text", placeholder: "Your Quarry Rewarder.", value: rewarderKeyStr, onChange: (e) => setRewarderKeyStr(e.target.value) })),
                React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "startTime" },
                    React.createElement("span", { className: "text-sm" }, "First Epoch Start Time"),
                    React.createElement(InputText, { id: "startTime", type: "datetime-local", placeholder: "Your Quarry Rewarder.", value: startTime, onChange: (e) => setStartTime(e.target.value) })),
                React.createElement(ModalButton, { buttonLabel: disabledReason ?? "Create Gaugemeister", buttonProps: {
                        disabled: !!disabledReason,
                    } }, operator && rewarder && (React.createElement(CreateGaugemeisterModal, { rewarder: rewarder, operator: operator, startTime: new Date(startTime) })))))));
};
