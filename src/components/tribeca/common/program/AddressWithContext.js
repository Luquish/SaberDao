import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { useAccountData } from "@rockooor/sail";
import { SuperCoder } from "@saberhq/anchor-contrib";
import { SystemProgram } from "@solana/web3.js";
import { startCase } from "lodash-es";
import { useMemo } from "react";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useSubaccountInfo } from "../../../../hooks/tribeca/useSubaccountInfo";
import { useIDL } from "../../../../hooks/tribeca/useIDLs";
import { SYSVAR_OWNER } from "../../../../utils/tribeca/programs";
import { AddressLink } from "../AddressLink";
import { ProgramLabel } from "./ProgramLabel";
import { SolAmount } from "./SolAmount";
export const createFeePayerValidator = (feeLamports) => {
    return (account) => {
        if (!account.accountInfo.owner.equals(SystemProgram.programId))
            return "Only system-owned accounts can pay fees";
        if (account.accountInfo.data.length > 0)
            return "Only unallocated accounts can pay fees";
        if (account.accountInfo.lamports < feeLamports) {
            return "Insufficient funds for fees";
        }
        return;
    };
};
export const programValidator = (account) => {
    if (!account.accountInfo.executable)
        return "Only executable accounts can be invoked";
    return;
};
export const AddressWithContext = ({ className, pubkey, validator, prefixLinkUrlWithAnchor = false, }) => {
    const info = useAccountData(pubkey);
    return (React.createElement("div", { className: clsx("flex items-end flex-col gap-0.5", className) },
        info.data?.accountInfo.executable ? (React.createElement(ProgramLabel, { address: pubkey, showCopy: true, showRaw: false, shorten: false })) : (React.createElement(AddressLink, { className: "dark:text-primary hover:text-opacity-80 font-mono", address: pubkey, showCopy: true, showRaw: false, shorten: false, prefixLinkUrlWithAnchor: prefixLinkUrlWithAnchor })),
        React.createElement(AccountInfo, { pubkey: pubkey, validator: validator })));
};
export const AccountInfo = ({ pubkey, validator }) => {
    const info = useAccountData(pubkey);
    const { data: idl } = useIDL(info.data?.accountInfo.owner);
    const subaccountInfo = useSubaccountInfo(pubkey);
    const accountName = useMemo(() => {
        if (!idl?.idl || !info.data) {
            return null;
        }
        const discriminator = info.data.accountInfo.data
            .slice(0, ACCOUNT_DISCRIMINATOR_SIZE)
            .toString("hex");
        const sc = new SuperCoder(idl.programID, idl.idl);
        return sc.discriminators[discriminator] ?? null;
    }, [idl?.idl, idl?.programID, info.data]);
    if (!info.data) {
        if (info.loading || subaccountInfo.isLoading) {
            return (React.createElement("span", { className: "text-gray-600 dark:text-gray-300" },
                React.createElement("span", { className: "spinner-grow spinner-grow-sm me-2" }),
                "Loading"));
        }
        else {
            if (subaccountInfo.data) {
                const subaccountData = subaccountInfo.data.account;
                return (React.createElement("span", null,
                    startCase(Object.keys(subaccountData.subaccountType)[0]),
                    " #",
                    subaccountData.index.toString(),
                    " of Smart Wallet",
                    " ",
                    React.createElement(Link, { className: "text-primary hover:text-white transition-colors", to: `/address/${subaccountData.smartWallet.toString()}` }, subaccountData.smartWallet.toString()),
                    "."));
            }
            return React.createElement("span", null, "Account not found");
        }
    }
    const errorMessage = validator && validator(info.data);
    if (errorMessage)
        return React.createElement("span", { className: "text-accent" }, errorMessage);
    if (info.data.accountInfo.executable) {
        return (React.createElement("span", { className: "text-gray-600 dark:text-gray-300" }, "Executable Program"));
    }
    const owner = info.data.accountInfo.owner;
    return (React.createElement("span", { className: "text-gray-600 dark:text-gray-300" }, owner ? (React.createElement(React.Fragment, null,
        owner.equals(SYSVAR_OWNER) ? ("Sysvar.") : (React.createElement(React.Fragment, null,
            accountName ? (React.createElement(React.Fragment, null,
                React.createElement(Link, { className: "text-primary hover:text-white transition-colors", to: `/address/${info.data.accountId.toString()}` }, accountName),
                " ",
                "o")) : ("O"),
            "wned by ",
            React.createElement(ProgramLabel, { address: owner }),
            ".")),
        " ",
        "Balance is ",
        React.createElement(SolAmount, { lamports: info.data.accountInfo.lamports }),
        ".")) : ("Account doesn't exist")));
};
