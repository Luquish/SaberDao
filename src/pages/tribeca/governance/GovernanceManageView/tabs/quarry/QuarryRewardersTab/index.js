import { useBatchedRewarders } from "@rockooor/react-quarry";
import { exists } from "@saberhq/solana-contrib";
import { FaHammer } from "react-icons/fa";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { AddressLink } from "@/common/AddressLink";
import { TableCardBody } from "@/common/card/TableCardBody";
import { Card } from "@/common/governance/Card";
import { CardWithImage } from "@/common/governance/CardWithImage";
import { ProseSmall } from "@/common/typography/Prose";
import { RewarderCard } from "./RewarderCard";
export const QuarryRewardersTab = () => {
    const { meta, daoName } = useGovernor();
    const allRewarderKeys = [
        meta?.quarry?.rewarder,
        ...(meta?.quarry?.additionalRewarders ?? []),
    ].filter(exists);
    const { data: allRewarders } = useBatchedRewarders(allRewarderKeys);
    const { ownerInvokerKey } = useExecutiveCouncil();
    return (React.createElement("div", { tw: "flex flex-col gap-4" },
        React.createElement(Card, { title: `${daoName ?? "DAO"} Rewards Programs` },
            React.createElement("div", { tw: "overflow-x-scroll whitespace-nowrap" },
                React.createElement(TableCardBody, { head: React.createElement("tr", null,
                        React.createElement("th", null, "Rewarder"),
                        React.createElement("th", null, "Rewards"),
                        React.createElement("th", null, "Roles")) }, allRewarders?.map((rewarder) => {
                    if (!rewarder) {
                        return null;
                    }
                    return (React.createElement(RewarderCard, { key: rewarder?.publicKey.toString(), rewarder: rewarder }));
                })))),
        React.createElement(CardWithImage, { title: "Manage your Quarries with Tribeca", image: React.createElement("div", { tw: "flex items-center justify-center h-full" },
                React.createElement(FaHammer, { tw: "h-20 w-20" })) },
            React.createElement(ProseSmall, null,
                React.createElement("p", null, "Grant your Executive Council's owner invoker permissions to set rates, create quarries, and allocate shares."),
                ownerInvokerKey && (React.createElement("p", null,
                    "Owner Invoker: ",
                    React.createElement(AddressLink, { address: ownerInvokerKey, showCopy: true })))))));
};
export default QuarryRewardersTab;
