import React, { useState } from 'react';
import { Keypair } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { FaDice } from "react-icons/fa";
import invariant from "tiny-invariant";
import { usePubkey } from "@rockooor/sail";
import { AsyncButton } from "../../../../../components/tribeca/common/AsyncButton";
import { Button } from "../../../../../components/tribeca/common/Button";
import { InputText } from "../../../../../components/tribeca/common/inputs/InputText";
import { LabeledInput } from "../../../../../components/tribeca/common/inputs/LabeledInput";
import { Section } from "../../../../../components/tribeca/layout/WalletLayout/Section";
import { LaunchDAOModal } from "./LaunchDAOModal";
import { DAOParamsFormSchema, DEFAULT_DAO_PARAMS } from "./params";
import { findGovernorAddress, findLockerAddress } from "@tribecahq/tribeca-sdk";
export const DAOStep4LockerView = () => {
    const params = new URLSearchParams(window.location.search);
    const executiveStr = params.get("executive");
    const emergencyStr = params.get("emergency");
    const executive = usePubkey(executiveStr);
    const emergencyDAO = usePubkey(emergencyStr);
    const [showModal, setShowModal] = useState(false);
    const [daoParams, setDaoParams] = useState(DEFAULT_DAO_PARAMS);
    const [baseKP, setBaseKP] = useState(Keypair.generate());
    const [govTokenMintStr, setGovTokenMintStr] = useState("");
    const govTokenMint = usePubkey(govTokenMintStr);
    const { data: keys } = useQuery({
        queryKey: ["lockedVoterKeys", baseKP?.publicKey.toString()],
        queryFn: async () => {
            invariant(baseKP);
            const [governor] = await findGovernorAddress(baseKP.publicKey);
            const [locker] = await findLockerAddress(baseKP.publicKey);
            return { governor, locker };
        },
        enabled: !!baseKP,
    });
    const { values, handleSubmit, handleChange, handleBlur, errors, touched, isSubmitting, isValid, } = useFormik({
        initialValues: DEFAULT_DAO_PARAMS,
        validationSchema: DAOParamsFormSchema,
        onSubmit: (values) => {
            setDaoParams(values);
            setShowModal(true);
        },
    });
    const governorKey = keys?.governor;
    const lockerKey = keys?.locker;
    const renderParamsForm = () => {
        return (React.createElement("div", { className: "grid grid-cols-2 gap-4" },
            React.createElement(Section, { title: "Set Govern Params" },
                React.createElement("div", null,
                    React.createElement(LabeledInput, { className: "mb-1.5", Component: InputText, id: "timelockDelaySeconds", label: "Timelock Delay (in seconds)", type: "text", onBlur: handleBlur, onChange: handleChange, error: errors.timelockDelaySeconds, touched: touched.timelockDelaySeconds }),
                    React.createElement(LabeledInput, { className: "mb-1.5", Component: InputText, id: "quorumVotes", label: "Quorum Votes (include decimals)", type: "text", value: values.quorumVotes, onBlur: handleBlur, onChange: handleChange, error: errors.quorumVotes, touched: touched.quorumVotes }),
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "votingDelay", Component: InputText, label: "Voting Delay (in seconds)", type: "text", value: values.votingDelay, onBlur: handleBlur, onChange: handleChange, error: errors.votingDelay, touched: touched.votingDelay }),
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "votingPeriod", Component: InputText, label: "Voting Period (in seconds)", type: "text", value: values.votingPeriod, onBlur: handleBlur, onChange: handleChange, error: errors.votingPeriod, touched: touched.votingPeriod }))),
            React.createElement(Section, { title: "Set Locker Params" },
                React.createElement("div", null,
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "maxStakeVoteMultiplier", Component: InputText, label: "Max Stake Vote Multiplier", type: "number", value: values.maxStakeVoteMultiplier, onBlur: handleBlur, onChange: handleChange, error: errors.maxStakeVoteMultiplier, touched: touched.maxStakeVoteMultiplier }),
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "proposalActivationMinVotes", Component: InputText, label: "Min Votes for Proposal Activation (include decimals)", type: "text", value: values.proposalActivationMinVotes, onBlur: handleBlur, onChange: handleChange, error: errors.proposalActivationMinVotes, touched: touched.proposalActivationMinVotes }),
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "minStakeDuration", Component: InputText, label: "Min Stake Duration (in seconds)", type: "text", value: values.minStakeDuration, onBlur: handleBlur, onChange: handleChange, error: errors.minStakeDuration, touched: touched.minStakeDuration }),
                    React.createElement(LabeledInput, { className: "mb-1.5", id: "maxStakeDuration", Component: InputText, label: "Max Stake Duration (in seconds)", type: "text", value: values.maxStakeDuration, onBlur: handleBlur, onChange: handleChange, error: errors.maxStakeDuration, touched: touched.maxStakeDuration })))));
    };
    const handleGovTokenMintChange = (e) => {
        setGovTokenMintStr(e.target.value);
    };
    return (React.createElement(React.Fragment, null,
        isValid && emergencyDAO && executive && govTokenMint && (React.createElement(LaunchDAOModal, { isOpen: showModal, onDismiss: () => setShowModal(false), daoParams: daoParams, baseKP: baseKP, emergencyDAO: emergencyDAO, executiveCouncil: executive, govTokenMint: govTokenMint })),
        React.createElement("div", { className: "grid gap-12 w-full max-w-sm mx-auto" },
            React.createElement("div", null,
                React.createElement("div", { className: "mb-8" },
                    React.createElement("h1", { className: "font-bold text-3xl mb-4 dark:text-gray-50" }, "Create the DAO"),
                    React.createElement("h2", { className: "text-secondary font-medium text-sm dark:text-gray-300" }, "Launch your Tribeca DAO by providing a governance token.")),
                React.createElement("div", { className: "flex flex-col gap-16" },
                    React.createElement("div", { className: "grid gap-4" },
                        React.createElement("label", { className: "flex flex-col", htmlFor: "govTokenMint" },
                            React.createElement("span", { className: "text-xs mb-1" }, "Governance Token Mint"),
                            React.createElement(InputText, { id: "govTokenMint", className: "h-10", value: govTokenMintStr, onChange: handleGovTokenMintChange })),
                        React.createElement("div", { className: "flex flex-col w-full" },
                            React.createElement("span", { className: "text-xs mb-1.5" }, "Governor Address"),
                            React.createElement("div", { className: "flex gap-2 w-full" },
                                React.createElement(InputText, { className: "h-10 flex-grow", disabled: true, value: governorKey?.toString() }),
                                React.createElement(Button, { className: "flex items-center gap-2 h-10", onClick: () => {
                                        setBaseKP(Keypair.generate());
                                    } },
                                    React.createElement("span", null, "Reroll"),
                                    React.createElement(FaDice, null)))),
                        React.createElement("div", { className: "flex flex-col w-full" },
                            React.createElement("span", { className: "text-xs mb-1.5" }, "Locker Address"),
                            React.createElement("div", { className: "flex gap-2 w-full" },
                                React.createElement(InputText, { className: "h-10 flex-grow", disabled: true, value: lockerKey?.toString() }),
                                React.createElement(Button, { className: "flex items-center gap-2 h-10", onClick: () => {
                                        setBaseKP(Keypair.generate());
                                    } },
                                    React.createElement("span", null, "Reroll"),
                                    React.createElement(FaDice, null)))),
                        React.createElement("div", { className: "flex flex-col" },
                            React.createElement("span", { className: "text-xs mb-1" }, "Executive Multisig"),
                            React.createElement(InputText, { className: "h-10", disabled: true, value: executive?.toString() })),
                        React.createElement("div", { className: "flex flex-col" },
                            React.createElement("span", { className: "text-xs mb-1" }, "Emergency Multisig"),
                            React.createElement(InputText, { className: "h-10", disabled: true, value: emergencyDAO?.toString() }))),
                    renderParamsForm(),
                    React.createElement("div", { className: "mx-auto flex flex-col items-center gap-6" },
                        React.createElement(AsyncButton, { type: "submit", className: "w-[200px]", variant: "primary", size: "md", disabled: !govTokenMint ||
                                !executive ||
                                !emergencyDAO ||
                                isSubmitting ||
                                !isValid, onClick: () => handleSubmit() }, "Submit")))))));
};
export default DAOStep4LockerView;
