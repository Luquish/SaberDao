export const ArgType = ({ type }) => {
    if (typeof type === "string") {
        return React.createElement(React.Fragment, null, type);
    }
    return React.createElement(React.Fragment, null, JSON.stringify(type));
};
