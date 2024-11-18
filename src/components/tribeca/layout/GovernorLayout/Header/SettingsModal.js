import { useState } from "react";
import { FaGear } from "react-icons/fa6";
import { useLocalStorage } from "usehooks-ts";
import React from "react";
import { Button } from "../../../common/Button";
import { Modal } from "../../../common/Modal";
export const SettingsModal = ({ className }) => {
    const [showModal, setShowModal] = useState(false);
    const [priorityFee, setPriorityFee] = useLocalStorage("priorityFee", 0);
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal, { className: "p-0", isOpen: showModal, onDismiss: () => {
                setShowModal(false);
            } },
            React.createElement("div", { className: "border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4" }, "Priority fee"),
            React.createElement("div", { className: "p-8 flex items-center justify-center gap-5" },
                React.createElement(Button, { variant: priorityFee === 0 ? "primary" : "outline", onClick: () => setPriorityFee(0) }, "None"),
                React.createElement(Button, { variant: priorityFee === 0.0001 ? "primary" : "outline", onClick: () => setPriorityFee(0.0001) }, "0.0001 SOL"),
                React.createElement(Button, { variant: priorityFee === 0.001 ? "primary" : "outline", onClick: () => setPriorityFee(0.001) }, "0.001 SOL"),
                React.createElement(Button, { variant: priorityFee === 0.01 ? "primary" : "outline", onClick: () => setPriorityFee(0.01) }, "0.01 SOL"))),
        React.createElement("div", { className: className },
            React.createElement("button", { className: "relative z-20 md:z-auto flex items-center hover:text-white transition-colors", onClick: () => {
                    setShowModal(true);
                } },
                React.createElement(FaGear, null)))));
};
