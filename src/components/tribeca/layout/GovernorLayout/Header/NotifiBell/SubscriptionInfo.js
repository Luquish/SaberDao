import React from "react";
const InfoRow = ({ value, placeholder }) => {
    if (value === "") {
        return React.createElement("span", { className: "text-sm text-secondary" }, placeholder);
    }
    else {
        return React.createElement("span", { className: "text-sm text-white" }, value);
    }
};
export const SubscriptionInfo = ({ email, phone, edit, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(InfoRow, { value: email, placeholder: "No email address" }),
        React.createElement(InfoRow, { value: phone === "" ? "" : `+1 ${phone}`, placeholder: "No phone number" }),
        React.createElement("button", { className: "flex justify-start", onClick: edit },
            React.createElement("span", { className: "text-sm text-primary" }, "Edit Information"))));
};
