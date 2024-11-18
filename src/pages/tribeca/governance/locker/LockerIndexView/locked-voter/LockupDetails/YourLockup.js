import { useSail } from "@rockooor/sail";
import { formatDistance } from "date-fns";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/useWrapTx";
import { Button } from "@/common/Button";
import { Card } from "@/common/governance/Card";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { TokenAmountDisplay } from "@/common/TokenAmountDisplay";
import { makeDate } from "../../../../proposals/ProposalIndexView/locked-voter/ProposalHistory";
import { CardItem } from "../CardItem";
export const YourLockup = ({ className }) => {
    const { veToken } = useGovernor();
    const { data: escrow, veBalance } = useUserEscrow();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    if (!escrow) {
        return React.createElement(React.Fragment, null);
    }
    const endDate = makeDate(escrow.escrow.escrowEndsAt);
    if (endDate <= new Date()) {
        return (React.createElement(Card, { title: "Your Lockup", className: className },
            React.createElement("div", { tw: "px-7 py-4 text-sm grid gap-4" },
                React.createElement("p", null, "Your lockup has expired. You may now withdraw your locked tokens."),
                React.createElement("div", null,
                    React.createElement(Button, { size: "md", variant: "primary", onClick: async () => {
                            const exitTX = await escrow.escrowW.exit();
                            const { pending, success } = await handleTX(await wrapTx(exitTX), "Exit Vote Escrow");
                            if (!success || !pending) {
                                return;
                            }
                            await pending.wait();
                        } }, "Withdraw Tokens")))));
    }
    const timeRemaining = formatDistance(endDate, new Date());
    return (React.createElement(Card, { title: "Your Lockup", className: className },
        React.createElement("div", { tw: "flex flex-row flex-wrap" },
            React.createElement(CardItem, { label: `${veToken?.symbol ?? "ve"} Balance` }, veBalance ? (React.createElement(TokenAmountDisplay, { amount: veBalance, showSymbol: false })) : (React.createElement(LoadingSpinner, null))),
            React.createElement(CardItem, { label: "Time Remaining" }, timeRemaining),
            React.createElement(CardItem, { label: "End Date" }, endDate.toLocaleDateString()))));
};
