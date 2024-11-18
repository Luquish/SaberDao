import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { formatNetwork } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
import { BsGear } from "react-icons/bs";
import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { CardWithImage } from "@/components/tribeca/common/governance/CardWithImage";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
const makeAPIUrl = (network, slug) => `https://api.github.com/repos/TribecaHQ/tribeca-registry/contents/config/${formatNetwork(network)}/${slug}/Tribeca.toml`;
export const ConfigTab = () => {
    const { meta } = useGovernor();
    const { network } = useEnvironment();
    const { data: configToml } = useQuery({
        queryKey: ["daoToml", network, meta?.slug],
        queryFn: async () => {
            if (!meta) {
                return meta;
            }
            const data = await fetchNullableWithSessionCache(makeAPIUrl(network, meta?.slug));
            if (!data) {
                return data;
            }
            return Buffer.from(data.content, "base64").toString("utf-8");
        },
    });
    return (React.createElement("div", { className: "flex flex-col gap-4" },
        React.createElement(CardWithImage, { title: "Configure your DAO", image: React.createElement("div", { className: "flex items-center justify-center h-full" },
                React.createElement(BsGear, { className: "w-20 h-20" })) },
            React.createElement(ProseSmall, null,
                React.createElement("p", null, "Your DAO manifest controls the features available to members of your DAO."),
                React.createElement(ExternalLink, { href: "https://github.com/tribecahq/tribeca-registry" }, "Learn more"))),
        React.createElement(Card, { title: React.createElement(React.Fragment, null,
                React.createElement("span", null, "DAO Configuration"),
                React.createElement("a", { href: `https://github.com/TribecaHQ/tribeca-registry/edit/master/config/${formatNetwork(network)}/${meta?.slug ?? ""}/Tribeca.toml`, target: "_blank", rel: "noopener noreferrer" },
                    React.createElement(Button, null, "Edit"))), titleClassName: "w-full items-center justify-between", padded: true },
            React.createElement("div", { className: "overflow-x-scroll whitespace-nowrap" },
                React.createElement(ProseSmall, null,
                    React.createElement("pre", null, configToml))))));
};
export default ConfigTab;
