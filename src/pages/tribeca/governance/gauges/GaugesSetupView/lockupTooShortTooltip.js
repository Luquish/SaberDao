import { FaExclamationTriangle } from "react-icons/fa";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
export const LockupTooShortTooltip = () => {
    return (React.createElement(MouseoverTooltip, { text: React.createElement("div", { tw: "max-w-sm" },
            React.createElement("p", null, "Your voting escrow expires before the start of the next epoch. Please extend your lockup to have your gauge vote count.")), placement: "bottom-start" },
        React.createElement(FaExclamationTriangle, { tw: "h-4 cursor-pointer inline-block align-middle mx-3 mb-0.5 text-yellow-500" })));
};
