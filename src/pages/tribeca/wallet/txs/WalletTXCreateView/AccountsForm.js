import { startCase } from "lodash-es";
import { InputText } from "../../../../common/inputs/InputText";
export const AccountsForm = ({ accountItems, accountsStrs, prefix, onChange, }) => {
    return (React.createElement("div", { tw: "grid gap-2" }, accountItems.map((account) => "accounts" in account ? (React.createElement("div", { tw: "border p-4" },
        React.createElement("span", null, account.name),
        React.createElement("div", null,
            React.createElement(AccountsForm, { key: account.name, accountItems: account.accounts, accountsStrs: accountsStrs, prefix: `${account.name}.`, onChange: onChange })))) : (React.createElement("div", { tw: "grid gap-1 grid-cols-2" },
        React.createElement("div", { tw: "flex items-center gap-2" },
            React.createElement("span", null, startCase(account.name)),
            account.isMut && (React.createElement("span", { tw: "rounded bg-primary text-white px-1 py-0.5" }, "writable")),
            account.isSigner && (React.createElement("span", { tw: "rounded bg-accent text-white px-1 py-0.5" }, "signer"))),
        React.createElement(InputText, { key: account.name, type: "text", placeholder: account.name, value: accountsStrs[`${prefix}${account.name}`] ?? "", onChange: (e) => {
                onChange(`${prefix}${account.name}`, e.target.value);
            } }))))));
};
