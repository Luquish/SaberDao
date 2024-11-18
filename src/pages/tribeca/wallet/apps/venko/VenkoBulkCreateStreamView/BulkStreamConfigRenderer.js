import { useUserATAs } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { AttributeList } from "../../../../../common/AttributeList";
import { AddressWithContext } from "../../../../../common/program/AddressWithContext";
export const BulkStreamConfigRenderer = ({ config, }) => {
    const total = config.recipients.reduce((acc, el) => el.amount.add(acc), new TokenAmount(config.token, 0));
    const [balance] = useUserATAs(config.token);
    return (React.createElement("div", null,
        React.createElement("div", null, "You are about to issue the following streams:"),
        React.createElement(AttributeList, { attributes: {
                Start: config.start,
                End: config.end,
                "Revocable?": config.revocable,
                Token: config.token,
                Total: total,
                "Your Balance": balance?.balance,
            } }),
        !balance || balance.balance.lessThan(total) ? (React.createElement("div", null, "Insufficient balance")) : null,
        React.createElement("div", { tw: "flex flex-col text-sm" }, config.recipients.map((rec) => (React.createElement("div", { key: rec.name, tw: "flex flex-col gap-1 py-4 border-b" },
            React.createElement("div", { tw: "flex justify-between" },
                React.createElement("span", null, rec.name),
                React.createElement("span", null, rec.amount.formatUnits())),
            React.createElement("div", null,
                React.createElement(AddressWithContext, { pubkey: rec.address }))))))));
};
