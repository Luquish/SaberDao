import invariant from "tiny-invariant";
import { useProgramDeployBuffer } from "@/hooks/tribeca/useAuthorityPrograms";
import { useProgramLabel } from "@/hooks/tribeca/useProgramMeta";
import { AddressLink } from "../../../AddressLink";
import React from "react";
export const UpgradeProgramInstruction = ({ data }) => {
    const bufferID = data.accounts.find((account) => account.name === "Buffer")?.pubkey;
    const programID = data.accounts.find((account) => account.name === "Program")?.pubkey;
    invariant(programID && bufferID);
    const label = useProgramLabel(programID);
    const { data: programDeployBuffer } = useProgramDeployBuffer(bufferID);
    return (React.createElement(React.Fragment, null,
        "Upgrade Program:\u00A0",
        React.createElement(AddressLink, { address: programID }, label),
        programDeployBuffer?.verifiableBuild ? (React.createElement(React.Fragment, null,
            "\u00A0to\u00A0",
            React.createElement("a", { className: "hover:text-primary", href: programDeployBuffer.verifiableBuild.build.build.source, target: "_blank", rel: "noreferrer" }, programDeployBuffer.verifiableBuild.build.build.tag))) : ("")));
};
