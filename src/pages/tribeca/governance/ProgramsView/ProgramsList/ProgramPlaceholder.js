import React from "react";
import { ContentLoader } from "../../../../common/ContentLoader";
export const ProgramPlaceholder = () => {
    return (React.createElement("div", { tw: "flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary" },
        React.createElement("div", null,
            React.createElement("div", { tw: "h-5 flex items-center" },
                React.createElement(ContentLoader, { tw: "h-3 rounded" })),
            React.createElement(PlaceholderSubtitle, null))));
};
export const PlaceholderSubtitle = () => (React.createElement("div", { tw: "flex items-center gap-2 mt-2" },
    React.createElement("div", { tw: "flex items-center gap-1" },
        React.createElement(ContentLoader, { tw: "h-2 w-4" }),
        React.createElement("span", null, "\u00B7"),
        React.createElement(ContentLoader, { tw: "h-2 w-20" }))));
