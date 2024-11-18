import { FaCheck, FaTimes } from "react-icons/fa";
import { Alert } from "../../../../common/Alert";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { ProseSmall } from "../../../../common/typography/Prose";
export const ChecklistItem = ({ title, description, pass, children, }) => {
    return (React.createElement("div", { tw: "px-7 py-4" },
        React.createElement("div", { tw: "flex flex-row justify-between" },
            React.createElement("th", null,
                React.createElement("span", { tw: "text-white font-semibold" }, title),
                React.createElement("span", { tw: "text-warmGray-600 font-normal text-xs" }, description)),
            React.createElement("td", null, pass ? (React.createElement("div", { tw: "bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaCheck, { tw: "h-3 w-3" }))) : pass === undefined ? (React.createElement(LoadingSpinner, { tw: "h-6 w-6" })) : (React.createElement("div", { tw: "bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaTimes, { tw: "h-3 w-3" }))))),
        pass === false && (React.createElement(Alert, { tw: "mt-4 text-white" },
            React.createElement(ProseSmall, null, children)))));
};
