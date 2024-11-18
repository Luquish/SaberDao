import { VoteSide } from "@tribecahq/tribeca-sdk";
import React from 'react';
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { CastVoteModal } from "./CastVoteModal";
export const CastVoteButton = ({ proposalInfo, side, }) => {
    return (React.createElement(ModalButton, { className: "max-w-md", buttonProps: {
            variant: "outline",
            className: "border-white w-2/5 hover:border-primary hover:bg-primary hover:bg-opacity-20",
        }, buttonLabel: side === null // Vote account not yet created
            ? "Cast Vote"
            : side === VoteSide.Pending
                ? "Cast Vote"
                : "Change Vote" },
        React.createElement(CastVoteModal, { proposalInfo: proposalInfo })));
};
