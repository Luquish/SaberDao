import { serializeToBase64 } from "../utils/tribeca/makeTransaction";
import { Memo } from "./Memo";
import { IssueTokensAction } from "./IssueTokensAction";
import { RawTX } from "./RawTX";
import { TransferTokensAction } from "./TransferTokensAction";
import { UpgradeProgramForm } from "./UpgradeProgramForm";
import { WhitelistEscrow } from "./WhitelistEscrow";
import { WhitelistProgram } from "./WhitelistProgram";
import React from "react";
export const ACTION_TYPES = [
    "Memo",
    "Issue Tokens",
    "Upgrade Program",
    "Whitelist Program-Managed Vote Escrow",
    "Pay from Treasury",
    "Raw Transaction (base64)",
];
export const ACTIONS = [
    {
        title: "Upgrade Program",
        Renderer: ({ setTxRaw }) => (React.createElement(UpgradeProgramForm, { onSelect: (tx) => {
                setTxRaw(serializeToBase64(tx));
            } })),
    },
    {
        title: "Issue Tokens",
        description: "Issue tokens on behalf of the DAO. This can be used for grants, liquidity mining, and more.",
        isEnabled: ({ minter }) => !!minter,
        Renderer: IssueTokensAction,
    },
    {
        title: "Whitelist Program-Managed Vote Escrow",
        description: "Whitelist an escrow to be managed by another program.",
        isEnabled: ({ locker, governor }) => !!locker && !!governor,
        Renderer: WhitelistEscrow,
    },
    {
        title: "Whitelist Program for Vote Escrows",
        description: "Whitelist a program to interact directly with all vote escrows.",
        isEnabled: ({ locker, governor }) => !!locker && !!governor,
        Renderer: WhitelistProgram,
    },
    {
        title: "Memo",
        description: "A memo allows a DAO to attest a message on chain. Memo actions may be used to create proposals that don't have any on-chain actions.",
        Renderer: Memo,
    },
    // {
    //   title: "Issue Revocable Token Grant",
    //   description: "Issue a revocable grant of tokens on behalf of the DAO.",
    //   isEnabled: ({ minter }) => !!minter,
    //   Renderer: VenkoGrantAction,
    // },
    {
        title: "Pay from Treasury",
        description: "Send tokens from the DAO treasury address to an address. This can be used for paying auditors, bounties, and other contributors.",
        Renderer: TransferTokensAction,
    },
    {
        title: "Raw Transaction (base64)",
        Renderer: RawTX,
    },
];
