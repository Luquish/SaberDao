import { useSail } from "@rockooor/sail";
import { buildStubbedTransaction } from "@saberhq/solana-contrib";
import { GovernorWrapper } from "@tribecahq/tribeca-sdk";
import { FaExternalLinkAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useGovernor, useGovernorParams, } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/useWrapTx";
import { notify } from "@/utils/notifications";
import { useEnvironment } from "@/utils/useEnvironment";
import { HelperCard } from "@/common/HelperCard";
import { Modal } from "@/common/Modal";
import { ModalInner } from "@/common/Modal/ModalInner";
import { ProposalIX } from "./ProposalIX";
export const ProposalConfirmModal = ({ proposal, ...modalProps }) => {
    const { network } = useEnvironment();
    const { tribecaMut } = useSDK();
    const { governor, path, minActivationThreshold } = useGovernor();
    const { votingPeriodFmt } = useGovernorParams();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const navigate = useNavigate();
    const doProposeTransaction = async () => {
        invariant(tribecaMut);
        const gov = new GovernorWrapper(tribecaMut, governor);
        const createProposal = await gov.createProposal({
            instructions: proposal.instructions,
        });
        const createProposalMetaTX = await gov.createProposalMeta({
            proposal: createProposal.proposal,
            title: proposal.title,
            descriptionLink: proposal.description,
        });
        for (const txEnv of [createProposal.tx, createProposalMetaTX]) {
            const { pending, success } = await handleTX(await wrapTx(txEnv), "Create Proposal");
            if (!success || !pending) {
                return;
            }
            await pending.wait();
        }
        notify({
            message: `Proposal ${`000${createProposal.index.toString()}`.slice(-4)} created`,
        });
        navigate(`${path}/proposals/${createProposal.index.toString()}`);
        modalProps.onDismiss();
    };
    return (React.createElement(Modal, { tw: "p-0 dark:text-white", ...modalProps },
        React.createElement(ModalInner, { title: `Proposal: ${proposal.title}`, buttonProps: {
                disabled: !tribecaMut,
                variant: "primary",
                onClick: doProposeTransaction,
                children: "Propose Transaction",
            } },
            React.createElement("div", { tw: "py-4 grid gap-4" },
                React.createElement(HelperCard, null,
                    React.createElement("p", { tw: "mb-1" }, "Tip: The proposal cannot be modified after submission, so please verify all information before submitting."),
                    React.createElement("p", null,
                        "Once submitted, anyone with at least",
                        " ",
                        minActivationThreshold?.formatUnits(),
                        " may start the voting period, i.e., activate the proposal. The voting period will then immediately begin and last for ",
                        votingPeriodFmt,
                        ".")),
                React.createElement("div", { tw: "break-words hyphens[auto]" },
                    React.createElement("div", { tw: "prose prose-sm prose-light" },
                        React.createElement(ReactMarkdown, null, proposal.description))),
                React.createElement("div", { tw: "flex flex-col gap-1.5" }, proposal.instructions.map((ix, i) => (React.createElement(ProposalIX, { key: i, ix: ix })))),
                network !== "localnet" && proposal.instructions.length > 0 && (React.createElement("a", { tw: "text-sm text-primary hover:text-white transition-colors flex items-center gap-2", href: `https://${network === "mainnet-beta" ? "" : `${network}.`}anchor.so/tx/inspector?message=${encodeURIComponent(buildStubbedTransaction(network, proposal.instructions)
                        .serializeMessage()
                        .toString("base64"))}`, target: "_blank", rel: "noreferrer" },
                    React.createElement("span", null, "Preview on Anchor.so"),
                    React.createElement(FaExternalLinkAlt, null)))))));
};
