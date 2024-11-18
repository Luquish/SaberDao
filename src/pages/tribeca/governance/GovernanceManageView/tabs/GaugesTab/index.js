import { AddGaugeCard } from "./AddGaugeCard";
import { GrantToEC } from "./GrantToEC";
export const GaugesTab = () => {
    return (React.createElement("div", { tw: "flex flex-col gap-4" },
        React.createElement(GrantToEC, null),
        React.createElement(AddGaugeCard, null)));
};
export default GaugesTab;
