import { findEpochGaugeVoteAddress } from "@quarryprotocol/gauge";
import { useQuarryData } from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { FORMAT_VOTE_PERCENT } from "@/utils/tribeca/format";
import { useGaugeData, useParsedEpochGaugeVote, } from "@/utils/tribeca/parsers";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Meter } from "@/components/tribeca/common/Meter";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { useGMData } from "../../hooks/useGaugemeister";
import { CommitVotesButton } from "./CommitVotesButton";
export const UserGauge = ({ className, gaugeVote, owner, }) => {
    const { data: gm } = useGMData();
    const { data: gauge } = useGaugeData(gaugeVote.key);
    const { data: quarry } = useQuarryData(gauge?.account.quarry);
    const { veToken } = useGovernor();
    const { data: stakedToken } = useToken(quarry?.account.tokenMintKey);
    const { data: epochGaugeVoteKey } = useQuery({
        queryKey: [
            "epochGaugeVoteKey",
            gaugeVote.key.toString(),
            gm?.publicKey.toString(),
        ],
        queryFn: async () => {
            invariant(gm);
            const [key] = await findEpochGaugeVoteAddress(gaugeVote.key, gm.account.currentRewardsEpoch + 1);
            return key;
        },
        enabled: !!gm,
    });
    const { data: epochGaugeVote } = useParsedEpochGaugeVote(epochGaugeVoteKey);
    return (React.createElement("tr", { className: className },
        React.createElement("td", null,
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(TokenIcon, { token: stakedToken }),
                React.createElement("div", null, stakedToken ? (React.createElement("span", null, stakedToken?.name)) : (React.createElement(ContentLoader, { className: "w-32 h-4" }))))),
        React.createElement("td", null, epochGaugeVote && veToken ? (new TokenAmount(veToken, epochGaugeVote.accountInfo.data.allocatedPower).formatUnits()) : epochGaugeVote === undefined ? (React.createElement(ContentLoader, { className: "w-20 h-4" })) : (React.createElement(CommitVotesButton, { owner: owner }))),
        React.createElement("td", null,
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { className: "w-16" },
                    React.createElement(Meter, { value: gaugeVote.percent ?? 0, max: 1, barColor: "var(--color-primary)" })),
                React.createElement("div", { className: "ml-2" }, gaugeVote.percent !== null
                    ? FORMAT_VOTE_PERCENT.format(gaugeVote.percent)
                    : "--")))));
};
