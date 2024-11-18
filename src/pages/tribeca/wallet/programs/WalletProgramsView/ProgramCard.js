import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { AddressLink } from "../../../../common/AddressLink";
import { SlotLink } from "../../../../common/SlotLink";
export const ProgramCard = ({ program, actions }) => {
    const label = useProgramLabel(program.programID);
    return (React.createElement("div", { tw: "flex items-center rounded bg-gray-50 border px-3 py-2 text-sm" },
        React.createElement("div", { tw: "flex flex-grow" },
            React.createElement("div", { tw: "flex-basis[236px] flex flex-col gap-1" },
                React.createElement("span", { tw: "font-medium text-gray-800" }, label),
                React.createElement("div", { tw: "text-xs flex gap-1 text-secondary" },
                    React.createElement("span", null, "ID:"),
                    React.createElement(AddressLink, { address: program.programID, showCopy: true }))),
            React.createElement("div", { tw: "invisible flex items-center gap-1 text-secondary" },
                React.createElement("span", null, "Deployed at:"),
                React.createElement("span", null,
                    React.createElement(SlotLink, { slot: program.lastDeploySlot })))),
        React.createElement("div", null, actions)));
};
