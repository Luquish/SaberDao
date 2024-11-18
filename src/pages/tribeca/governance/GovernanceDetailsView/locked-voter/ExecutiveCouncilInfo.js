import { useExecutiveCouncil } from "../../../../../hooks/tribeca/useExecutiveCouncil";
import { NamedAddressLink } from "../../../../common/account/NamedAddressLink";
import { AttributeList } from "../../../../common/AttributeList";
import { Card } from "../../../../common/governance/Card";
import { HelperCard } from "../../../../common/HelperCard";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
export const ExecutiveCouncilInfo = () => {
    const { ecWallet, ownerInvokerKey } = useExecutiveCouncil();
    return (React.createElement(Card, { title: "Executive Council", tw: "pb-2" },
        React.createElement("div", { tw: "px-5 my-5" },
            React.createElement(HelperCard, null,
                React.createElement("p", null, "All members of the Executive Council may execute transactions that have been approved by governance and have surpassed the timelock."),
                React.createElement(ExternalLink, { tw: "mt-2", href: "https://docs.tribeca.so/more-resources/recommended-configuration#executive-council" }, "Learn more"))),
        React.createElement(AttributeList, { attributes: {
                Key: ecWallet.data?.publicKey,
                "Owner Invoker": ownerInvokerKey,
                Members: (React.createElement("div", { tw: "flex flex-col gap-1 items-end" }, ecWallet.data?.account.owners.map((owner) => (React.createElement(NamedAddressLink, { key: owner.toString(), address: owner, showCopy: true }))))),
            } })));
};
