import { HiOutlineExternalLink } from "react-icons/hi";
import React from "react";
export const MarinadeMigration = () => {
    return (React.createElement("div", { className: "w-full p-6 border-2 border-[#FFD84D] bg-[#FFD84D]/10 rounded-lg flex flex-col items-center text-center" },
        React.createElement("h1", { className: "text-white text-2xl font-bold" },
            "Marinade Governance has moved to",
            " ",
            React.createElement("a", { href: "https://app.realms.today/dao/mnde", target: "_blank", rel: "noopener noreferrer", className: "text-[#00D18C] hover:underline inline-flex gap-2 items-center" },
                "Realms",
                React.createElement(HiOutlineExternalLink, null))),
        React.createElement("p", { className: "text-white mt-4 mb-6" },
            "Tribeca is deprecated for Marinade. To migrate your locked MNDE, go to",
            " ",
            React.createElement("a", { href: "https://marinade.finance/app/mnde", target: "_blank", rel: "noopener noreferrer", className: "text-[#00D18C] hover:underline inline-flex gap-1 items-center" },
                "Marinade.Finance app",
                React.createElement(HiOutlineExternalLink, null)),
            " ",
            "and follow the instructions to migrate your locked MNDE to the new system and use your tokens' voting power in Realms!"),
        React.createElement("a", { href: "https://marinade.finance/app/mnde", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 border border-[#00D18C] hover:bg-[#00D18C]/10 px-4 py-2.5 text-[#00D18C] font-bold text-lg rounded" },
            "Go to migration",
            React.createElement(HiOutlineExternalLink, null))));
};
