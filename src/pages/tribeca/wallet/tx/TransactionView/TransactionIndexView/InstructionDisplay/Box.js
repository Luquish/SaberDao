export const Box = ({ title, children, className }) => (React.createElement("div", { tw: "border dark:border-warmGray-600 rounded text-sm" },
    React.createElement("h2", { tw: "px-6 py-2 font-semibold text-gray-800 dark:text-gray-100" }, title),
    React.createElement("div", { tw: "px-6 py-2 border-t border-t-gray-150 dark:border-t-warmGray-600", className: className }, children)));
