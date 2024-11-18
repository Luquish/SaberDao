export const CardItem = ({ label, children }) => {
    return (React.createElement("div", { tw: "px-7 py-4 border-b border-warmGray-800" },
        React.createElement("span", { tw: "text-warmGray-400 text-sm" }, label),
        React.createElement("div", { tw: "text-xl text-white mt-0.5" }, children)));
};
