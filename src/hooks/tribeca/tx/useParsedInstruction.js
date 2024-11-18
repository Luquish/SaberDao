import { BorshCoder } from "@project-serum/anchor";
import { startCase } from "lodash-es";
import { useMemo } from "react";
import { parseNonAnchorInstruction } from "../../../utils/tribeca/instructions/parseNonAnchorInstruction";
import { useIDL } from "../useIDLs";
import { useProgramLabel } from "../useProgramMeta";
const flattenIdlAccounts = (accounts, prefix) => {
    return accounts
        .map((account) => {
        const accName = startCase(account.name);
        if ("accounts" in account) {
            const newPrefix = prefix ? `${prefix} > ${accName}` : accName;
            return flattenIdlAccounts(account.accounts, newPrefix);
        }
        else {
            return {
                ...account,
                name: prefix ? `${prefix} > ${accName}` : accName,
            };
        }
    })
        .flat();
};
export const useParsedProposalInstruction = (ix) => {
    return useParsedInstruction(useMemo(() => ({ ...ix, data: Buffer.from(ix.data) }), [ix]));
};
export const useParsedInstruction = (ix) => {
    const { data: idl } = useIDL(ix.programId);
    const label = useProgramLabel(ix.programId);
    const anchorIX = useMemo(() => {
        if (!idl?.idl) {
            return null;
        }
        const coder = new BorshCoder(idl.idl);
        const decoded = coder.instruction.decode(Buffer.from(ix.data));
        if (!decoded) {
            return null;
        }
        const idlIx = idl.idl.instructions.find((i) => decoded.name === i.name);
        if (idlIx) {
            const flatIdlAccounts = flattenIdlAccounts(idlIx.accounts);
            const accounts = ix.keys.map((meta, idx) => {
                if (idx < flatIdlAccounts.length) {
                    return {
                        name: flatIdlAccounts[idx]?.name ?? `Account #${idx + 1}`,
                        ...meta,
                    };
                }
                // "Remaining accounts" are unnamed in Anchor.
                else {
                    return {
                        name: `Account #${idx + 1}`,
                        ...meta,
                    };
                }
            });
            return {
                name: decoded.name,
                data: { type: "object", args: decoded.data },
                accounts,
            };
        }
        let parsed = null;
        try {
            parsed = coder.instruction.format(decoded, ix.keys);
        }
        catch (e) {
            console.warn(`Error formatting instruction`, e);
        }
        if (parsed) {
            return {
                name: decoded.name,
                data: { type: "anchor", args: parsed.args },
                accounts: parsed.accounts,
            };
        }
        if (idl.idl.state) {
            const methodSoap = idl.idl.state.methods.find((m) => m.name === decoded.name);
            const parsed = new BorshCoder({
                ...idl.idl,
                instructions: methodSoap
                    ? [
                        {
                            ...methodSoap,
                            accounts: [
                                {
                                    name: `Program State`,
                                    isMut: true,
                                    isSigner: false,
                                },
                                ...methodSoap.accounts,
                            ],
                        },
                    ]
                    : [],
            }).instruction.format(decoded, ix.keys);
            if (!parsed) {
                return null;
            }
            return {
                name: decoded.name,
                data: { type: "anchor", args: parsed.args },
                accounts: parsed.accounts,
            };
        }
        return null;
    }, [idl?.idl, ix]);
    const decodedIX = useMemo(() => {
        if (anchorIX) {
            return anchorIX;
        }
        const parsedNonAnchor = parseNonAnchorInstruction(ix);
        if (!parsedNonAnchor || "error" in parsedNonAnchor) {
            return null;
        }
        const { name, accountLabels, program: _program, ...args } = parsedNonAnchor;
        return {
            name,
            data: { type: "object", args },
            accounts: ix.keys.map((accountMeta, i) => {
                const label = accountLabels?.[i];
                return {
                    ...accountMeta,
                    name: label ?? `Account #${i + 1}`,
                };
            }),
        };
    }, [anchorIX, ix]);
    const name = decodedIX ? startCase(decodedIX.name) : "Unknown Instruction";
    const title = `${label}: ${name}`;
    return {
        title,
        name,
        data: decodedIX?.data ?? { type: "raw", data: ix.data },
        accounts: decodedIX?.accounts ?? ix.keys,
        programID: ix.programId,
    };
};
