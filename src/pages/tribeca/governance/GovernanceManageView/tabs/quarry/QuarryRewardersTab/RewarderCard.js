import { useMintWrapperData, useOperatorData, useRewarderConfig, } from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import BN from "bn.js";
import { useEnvironment } from "@/utils/useEnvironment";
import { TokenIcon } from "@/common/TokenIcon";
export const RewarderCard = ({ rewarder }) => {
    const { data: rewarderConfig } = useRewarderConfig(rewarder.publicKey.toString());
    const rewarderInfo = rewarderConfig?.info;
    const { data: rewardsToken } = useToken(rewarderConfig?.info?.redeemer?.underlyingToken ??
        rewarderConfig?.rewardsToken.mint);
    const dailyRewardsRate = rewardsToken
        ? new TokenAmount(rewardsToken, rewarder.account.annualRewardsRate.div(new BN(365)))
        : rewardsToken;
    const { network } = useEnvironment();
    const rewarderLink = `https://${network === "mainnet-beta"
        ? "app"
        : network === "devnet"
            ? "devnet"
            : network === "testnet"
                ? "testnet"
                : "app"}.quarry.so/#/rewarders/${rewarder.publicKey.toString()}/quarries`;
    const { data: mintWrapperData } = useMintWrapperData(rewarder.account.mintWrapper);
    const { data: operatorData } = useOperatorData(rewarder.account.authority);
    return (React.createElement("tr", null,
        React.createElement("td", null,
            React.createElement("h3", null,
                React.createElement("a", { href: rewarderLink, target: "_blank", rel: "noreferrer" }, rewarderInfo?.name ?? rewarder.publicKey.toString())),
            React.createElement("span", null,
                rewarderConfig?.quarries.length.toLocaleString() ?? "--",
                " quarries")),
        React.createElement("td", null,
            React.createElement("div", { tw: "flex items-center gap-4" },
                React.createElement(TokenIcon, { token: rewardsToken }),
                React.createElement("div", { tw: "flex flex-col" },
                    React.createElement("span", { tw: "text-white" },
                        dailyRewardsRate?.formatUnits() ?? "--",
                        "/day"),
                    React.createElement("span", null, rewardsToken?.name)))),
        React.createElement("td", null,
            React.createElement("ul", null,
                React.createElement("li", null,
                    "Mint Wrapper Authority: ",
                    mintWrapperData?.account.admin.toString()),
                React.createElement("li", null,
                    "Operator Admin: ",
                    operatorData?.account.admin.toString()),
                React.createElement("li", null,
                    "Quarry Creator: ",
                    operatorData?.account.quarryCreator.toString()),
                React.createElement("li", null,
                    "Share Allocator: ",
                    operatorData?.account.shareAllocator.toString()),
                React.createElement("li", null,
                    "Rate Setter: ",
                    operatorData?.account.rateSetter.toString())))));
};
