import { useState } from "react";
import { Tooltip } from "../../../../../common/MouseoverTooltip";
export const CustomTooltip = ({ content, children, disableOnClick = false, }) => {
    const [show, setShow] = useState(false);
    return (React.createElement(Tooltip, { show: show, text: React.createElement("div", { tw: "max-w-sm text-center", onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false) },
            React.createElement("p", { tw: "whitespace-normal" }, content)), placement: "bottom" },
        React.createElement("div", { tw: "flex items-center justify-center" },
            React.createElement("button", { onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false), onClick: () => {
                    if (disableOnClick) {
                        setShow(false);
                    }
                }, onKeyDown: () => {
                    if (disableOnClick) {
                        setShow(false);
                    }
                } }, children))));
};
