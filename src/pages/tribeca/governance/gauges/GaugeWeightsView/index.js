import { ZERO } from "@quarryprotocol/quarry-sdk";
import { RewarderProvider } from "@rockooor/react-quarry";
import React from "react";
import { Link } from "gatsby";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { useParsedGaugemeister } from "../../../../../utils/tribeca/parsers";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { Card } from "../../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { InputSearchText } from "../../../../../components/tribeca/common/inputs/InputSearchText";
import { LoadingPage } from "../../../../../components/tribeca/common/LoadingPage";
import { ExternalLink } from "../../../../../components/tribeca/common/typography/ExternalLink";
import { LockupTooShortTooltip } from "../GaugesSetupView/lockupTooShortTooltip";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { GaugeWeightsForm } from "./GaugeWeightsForm";
import { UpdateGaugeWeightsProvider } from "./useUpdateGaugeWeights";
export const GaugeWeightsView = () => {
    const [filterTerm, setFilterTerm] = React.useState("");
    const gaugemeister = useGaugemeister();
    const gm = useParsedGaugemeister(gaugemeister);
    const { govToken, veToken, path } = useGovernor();
    const { network } = useEnvironment();
    const { escrow } = useUserEscrow();
    const rewarderKey = gm.data?.accountInfo.data.rewarder;
    const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(gm.data?.accountInfo.data.nextEpochStartsAt ?? ZERO);
    useGovWindowTitle(`Your Gauge Weights`);
    return (React.createElement(GovernancePage, { title: "Your Gauge Weights", backLink: {
            label: "Gauges",
            href: `${path}/gauges`,
        } },
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement(Card, { title: "Gauge Weight Voting" },
                React.createElement("div", { className: "px-8 py-5 text-sm" },
                    React.createElement("p", null,
                        "You can vote for gauge weight with your ",
                        veToken?.symbol,
                        " tokens (locked ",
                        govToken?.symbol,
                        " tokens in",
                        " ",
                        React.createElement(Link, { className: "text-primary hover:text-white transition-colors", to: `${path}/locker` }, "Locker"),
                        "). Gauge weights are used to determine how much ",
                        govToken?.symbol,
                        " ",
                        "each pool gets."),
                    React.createElement(ExternalLink, { className: "mt-4", href: "https://docs.tribeca.so/features/gauges" }, "Learn more"))),
            React.createElement(Card, { title: React.createElement("div", { className: "flex w-full items-center justify-between" },
                    React.createElement("div", { className: "flex" },
                        React.createElement("span", null, "Your Gauge Weights"),
                        lockupTooShort && React.createElement(LockupTooShortTooltip, null)),
                    React.createElement(InputSearchText, { onChange: (evt) => setFilterTerm(evt.target.value), value: filterTerm, placeholder: "Filter Gauges.." })) }, gm.loading ? (React.createElement(LoadingPage, { className: "p-16" })) : (rewarderKey && (React.createElement(RewarderProvider, { initialState: { rewarderKey, network } },
                React.createElement(UpdateGaugeWeightsProvider, null,
                    React.createElement(GaugeWeightsForm, { filterTerm: filterTerm })))))))));
};
export default GaugeWeightsView;
