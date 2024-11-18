import React from "react";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { useGovernorInfo } from "../../../../../hooks/tribeca/useGovernor";
import { SubscriptionForm } from "./SubscriptionForm";
import { SubscriptionGlimmer } from "./SubscriptionGlimmer";
export const SubscriptionFormContainer = (props) => {
    const info = useGovernorInfo();
    const manifest = info?.manifest;
    const loading = info?.loading ?? true;
    return loading || !manifest ? (React.createElement(SubscriptionGlimmer, null)) : (React.createElement(LockedVoterSubscriptionForm, { ...props }));
};
const LockedVoterSubscriptionForm = ({ inputDisabled, submitDisabled, warningMessage, ...rest }) => {
    const { isEscrowLoading, veBalance, isLoading } = useUserEscrow();
    const localDisabled = !veBalance || veBalance.asNumber <= 0;
    const localWarningMessage = localDisabled
        ? "You need voting power to subscribe"
        : warningMessage;
    return isEscrowLoading || isLoading ? (React.createElement(SubscriptionGlimmer, null)) : (React.createElement(SubscriptionForm, { inputDisabled: localDisabled || inputDisabled, submitDisabled: localDisabled || submitDisabled, warningMessage: localWarningMessage, ...rest }));
};
