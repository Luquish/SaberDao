import { FaArrowRight } from "react-icons/fa";
import { CardWithImage } from "../../../../common/governance/CardWithImage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
import { ProseSmall } from "../../../../common/typography/Prose";
import { ReactComponent as AboutSAVEImage } from "./AboutSAVEImage.svg";
export const AboutSAVE = () => {
    return (React.createElement(CardWithImage, { title: "About SAVE Tokens", image: React.createElement("div", { tw: "flex items-center justify-center p-8" },
            React.createElement(AboutSAVEImage, { tw: "w-3/4 h-3/4" })) },
        React.createElement(ProseSmall, null,
            React.createElement("p", null,
                "The Simple Agreement for Vote-Escrowed Tokens, i.e. ",
                React.createElement("em", null, "SAVE"),
                ", is a token derivative which enforces that membership tokens must be locked for a specific period of time."),
            React.createElement("p", null, "As SAVEs are not directly convertible to the underlying token, SAVEs are a powerful primitive for issuing grants for DAO participants that do not restrict transferability of tokens."),
            React.createElement(ExternalLink, { href: "https://github.com/TribecaHQ/save", icon: React.createElement(FaArrowRight, null) }, "Learn more"))));
};
