import { ContentLoader } from "../../../../../common/ContentLoader";
export const GaugeRowPlaceholder = () => {
    return (React.createElement("tr", null,
        React.createElement("td", null,
            React.createElement("div", { tw: "h-10 flex items-center" },
                React.createElement(ContentLoader, { tw: "w-10 h-4" }))),
        React.createElement("td", null,
            React.createElement("div", { tw: "h-10 flex items-center" },
                React.createElement(ContentLoader, { tw: "w-32 h-4" }))),
        React.createElement("td", null,
            React.createElement("div", { tw: "h-10 flex items-center" },
                React.createElement(ContentLoader, { tw: "w-12 h-4" }))),
        React.createElement("td", null,
            React.createElement("div", { tw: "h-10 flex items-center" },
                React.createElement(ContentLoader, { tw: "w-12 h-4" })))));
};
