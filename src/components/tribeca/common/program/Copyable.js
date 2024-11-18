import { useState } from "react";
import { FiCheckCircle, FiCopy, FiXCircle } from "react-icons/fi";
import React from "react";
export const Copyable = ({ text, children, replaceText, }) => {
    const [state, setState] = useState("copy");
    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setState("copied");
        }
        catch (err) {
            setState("errored");
        }
        setTimeout(() => setState("copy"), 1000);
    };
    function CopyIcon() {
        if (state === "copy") {
            return (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            React.createElement("button", { className: "cursor-pointer", onClick: handleClick },
                React.createElement(FiCopy, null)));
        }
        else if (state === "copied") {
            return (React.createElement("span", null,
                React.createElement(FiCheckCircle, null)));
        }
        else if (state === "errored") {
            return (React.createElement("span", { title: "Please check your browser's copy permissions." },
                React.createElement(FiXCircle, null)));
        }
        return null;
    }
    let message;
    if (state === "copied") {
        message = "Copied";
    }
    else if (state === "errored") {
        message = "Copy Failed";
    }
    function PrependCopyIcon() {
        return (React.createElement(React.Fragment, null,
            React.createElement("span", { className: "text-xs m-2" },
                React.createElement("span", { className: "flex items-center gap-1" },
                    message !== undefined && React.createElement("span", null, message),
                    React.createElement(CopyIcon, null))),
            children));
    }
    function ReplaceWithMessage() {
        return (React.createElement("span", { className: "flex flex-col flex-nowrap" },
            React.createElement("span", { className: "text-xs" },
                React.createElement("span", { className: "flex items-center text-primary" },
                    React.createElement(CopyIcon, null),
                    React.createElement("span", { className: "mx-2" }, message))),
            React.createElement("span", { className: "hidden" }, children)));
    }
    if (state === "copy") {
        return React.createElement(PrependCopyIcon, null);
    }
    else if (replaceText) {
        return React.createElement(ReplaceWithMessage, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("span", { className: "hidden lg:inline" },
            React.createElement(PrependCopyIcon, null)),
        React.createElement("span", { className: "inline lg:hidden" },
            React.createElement(ReplaceWithMessage, null))));
};
