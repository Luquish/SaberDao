import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { AddressLink } from "../../../../common/AddressLink";
import { SlotLink } from "../../../../common/SlotLink";
export const ProgramCard = ({ program, actions }) => {
    const label = useProgramLabel(program.programID);
    return (React.createElement("div", { tw: "text-sm flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800" },
        React.createElement("div", { tw: "flex flex-grow w-2/3" },
            React.createElement("div", { tw: "flex-basis[236px] flex flex-col gap-1" },
                React.createElement("span", { tw: "font-medium text-white" }, label),
                React.createElement("div", { tw: "text-xs flex gap-1 text-secondary" },
                    React.createElement("span", null, "ID:"),
                    React.createElement(AddressLink, { address: program.programID, showCopy: true }))),
            React.createElement("div", { tw: "invisible lg:flex lg:ml-12 lg:visible items-center gap-1 text-secondary" },
                React.createElement("span", null, "Deployed At:"),
                React.createElement("span", null,
                    React.createElement(SlotLink, { slot: program.lastDeploySlot })))),
        React.createElement("div", null, actions)));
};
