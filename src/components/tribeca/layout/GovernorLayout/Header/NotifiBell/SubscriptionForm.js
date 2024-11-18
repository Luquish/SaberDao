import React from "react";
import { FaEnvelope, FaMobileAlt } from "react-icons/fa";
import { Button } from "../../../../common/Button";
import { IconInput } from "./IconInput";
export const SubscriptionForm = ({ email, inputDisabled, submitDisabled, submitLabel, phone, warningMessage, setEmail, setPhone, submit, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(IconInput, { disabled: inputDisabled, icon: React.createElement(FaEnvelope, null), className: "pl-8", name: "email", type: "email", onChange: (e) => {
                setEmail(e.target.value ?? "");
            }, placeholder: "Email Address", value: email }),
        React.createElement(IconInput, { disabled: inputDisabled, icon: React.createElement(React.Fragment, null,
                React.createElement(FaMobileAlt, null),
                React.createElement("span", { className: "py-2 text-sm ml-1 text-secondary" }, "+1")), className: "pl-12", name: "phone", type: "tel", onChange: (e) => {
                setPhone(e.target.value ?? "");
            }, placeholder: "Phone Number", value: phone }),
        warningMessage ? (React.createElement("div", { className: "text-red-500 text-xs" },
            React.createElement("span", null, warningMessage))) : null,
        React.createElement(Button, { disabled: submitDisabled, variant: "primary", className: "text-base align-self[center] font-semibold px-10 py-6 mt-2 mb-4 hover:(bg-white text-black)", onClick: submit },
            React.createElement("span", null, submitLabel))));
};
