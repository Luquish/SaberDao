import { AddressLink } from "../../../../../common/AddressLink";
export const TXEvent = ({ event }) => {
    switch (event.name) {
        case "TransactionCreateEvent":
            return (React.createElement(React.Fragment, null,
                React.createElement(AddressLink, { tw: "text-gray-800 font-medium", address: event.data.proposer }),
                " ",
                React.createElement("span", null, "proposed the transaction.")));
        case "TransactionApproveEvent":
            return (React.createElement(React.Fragment, null,
                React.createElement(AddressLink, { tw: "text-gray-800 font-medium", address: event.data.owner }),
                " ",
                React.createElement("span", null, "approved the transaction.")));
        case "TransactionExecuteEvent":
            return (React.createElement(React.Fragment, null,
                React.createElement(AddressLink, { tw: "text-gray-800 font-medium", address: event.data.executor }),
                " ",
                React.createElement("span", null, "executed the transaction.")));
        case "WalletSetOwnersEvent":
            return (React.createElement(React.Fragment, null,
                React.createElement("span", null, "The owners of the wallet were changed to"),
                " ",
                event.data.owners.map((owner, i) => (React.createElement(React.Fragment, null,
                    i !== 0 && React.createElement("span", null, ", "),
                    React.createElement(AddressLink, { key: i, tw: "text-gray-800 font-medium", address: owner })))),
                "."));
        default:
            return React.createElement(React.Fragment, null, "unknown");
    }
};
