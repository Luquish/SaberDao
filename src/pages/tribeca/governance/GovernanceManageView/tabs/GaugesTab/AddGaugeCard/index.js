import { RewarderProvider } from "@rockooor/react-quarry";
import React from 'react';
import { useParsedGaugemeister } from "@/utils/tribeca/parsers";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { useGaugemeister } from "../../../../gauges/hooks/useGaugemeister";
import { CreateGaugesButton } from "./CreateGaugesButton";
import { EnableGaugesButton } from "./EnableGaugesButton";
import { GaugeSelector } from "./GaugeSelector";
export const AddGaugeCard = () => {
    const gaugemeister = useGaugemeister();
    const gm = useParsedGaugemeister(gaugemeister);
    const { network } = useEnvironment();
    const rewarderKey = gm.data?.accountInfo.data.rewarder;
    if (!rewarderKey) {
        return (React.createElement(Card, { title: "All Gauges" },
            React.createElement(LoadingPage, null)));
    }
    return (React.createElement(RewarderProvider, { initialState: { rewarderKey, network } },
        React.createElement(Card, { titleClassName: "flex items-center justify-between", title: React.createElement(React.Fragment, null,
                React.createElement("span", null, "All Gauges"),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement(CreateGaugesButton, null),
                    React.createElement(EnableGaugesButton, null))) },
            React.createElement(GaugeSelector, null))));
};
