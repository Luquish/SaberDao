import { Switch } from "@headlessui/react";
import React, { useState } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "./LoadingSpinner";
export function Toggle({ label, checked, onChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const [pendingChecked, setPendingChecked] = useState(checked);
    const displayChecked = isLoading ? pendingChecked : checked;
    return (React.createElement(Switch.Group, null,
        React.createElement("div", { className: "flex items-center text-sm" },
            React.createElement(Switch, { checked: displayChecked, disabled: isLoading, onChange: async (value) => {
                    setPendingChecked(value);
                    setIsLoading(true);
                    try {
                        await onChange(value);
                    }
                    catch (e) {
                        console.error(e);
                    }
                    setIsLoading(false);
                }, className: clsx('relative inline-flex items-center h-6 rounded-full w-11 transition-colors', displayChecked ? 'bg-primary' : 'bg-warmGray-600', isLoading && 'bg-warmGray-400') },
                React.createElement("span", { className: clsx('inline-block w-4 h-4 transform bg-white rounded-full transition-transform', displayChecked ? 'translate-x-6' : 'translate-x-1') })),
            isLoading && React.createElement(LoadingSpinner, { className: "ml-2 text-warmGray-400" }),
            label && (React.createElement(Switch.Label, { className: "ml-2 font-medium text-warmGray-400" }, label)))));
}
