import { findOwnerInvokerAddress, findSmartWallet } from "@gokiprotocol/client";
import { useSail } from "@rockooor/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { createLocker, findGovernorAddress } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import * as Yup from "yup";
import { useSDK } from "../../../../../contexts/sdk";
import { useKeypair } from "../../../../../hooks/useKeypair";
import { useSmartWalletAddress } from "../../../../../hooks/useSmartWalletAddress";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { AttributeList } from "../../../../common/AttributeList";
import { InputText, Textarea } from "../../../../common/inputs/InputText";
const DAY = 86_400;
const validateKeyPair = (kpStr) => {
    if (!kpStr) {
        return false;
    }
    try {
        return !!kpSeedToKP(kpStr);
    }
    catch (e) {
        return false;
    }
};
const kpSeedToKP = (secretKey) => {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(secretKey)));
};
const CustomDAOFormSchema = Yup.object().shape({
    govTokenMintStr: Yup.string()
        .required("Required")
        .test("Required", "Invalid public key", (str) => {
        if (!str) {
            return false;
        }
        try {
            new PublicKey(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }),
    execBaseKP: Yup.string()
        .required("Required")
        .test("execBaseKP", "Invalid keypair JSON", (str) => {
        return validateKeyPair(str);
    }),
    sosBaseKP: Yup.string()
        .required("Required")
        .test("sosBaseKP", "Invalid keypair JSON", (str) => {
        return validateKeyPair(str);
    }),
    govBaseKP: Yup.string()
        .required("Required")
        .test("govBaseKP", "Invalid keypair JSON", (str) => {
        return validateKeyPair(str);
    }),
    govWalletBaseKP: Yup.string()
        .required("Required")
        .test("govWalletBaseKP", "Invalid keypair JSON", (str) => {
        return validateKeyPair(str);
    }),
    lockerBaseKP: Yup.string()
        .required("Required")
        .test("lockerBaseKP", "Invalid keypair JSON", (str) => {
        return validateKeyPair(str);
    }),
});
export const DAOCustomView = () => {
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { sdkMut, tribecaMut } = useSDK();
    const navigate = useNavigate();
    const initialBaseKPs = useMemo(() => new Array(5)
        .fill(null)
        .map(() => JSON.stringify([...Keypair.generate().secretKey])), []);
    const formik = useFormik({
        initialValues: {
            govTokenMintStr: "",
            execBaseKP: initialBaseKPs[0],
            sosBaseKP: initialBaseKPs[1],
            govBaseKP: initialBaseKPs[2],
            govWalletBaseKP: initialBaseKPs[3],
            lockerBaseKP: initialBaseKPs[4],
        },
        validationSchema: CustomDAOFormSchema,
        onSubmit: async (values) => {
            try {
                invariant(sdkMut, "sdk");
                invariant(tribecaMut, "sdk");
                const execBaseKP = kpSeedToKP(values.execBaseKP);
                const [executive] = await findSmartWallet(execBaseKP.publicKey);
                const [ownerInvoker] = await findOwnerInvokerAddress(executive, 0);
                const sosBaseKP = kpSeedToKP(values.sosBaseKP);
                const [emergencyDAO] = await findSmartWallet(sosBaseKP.publicKey);
                const govBaseKP = kpSeedToKP(values.govBaseKP);
                const [governorKey] = await findGovernorAddress(govBaseKP.publicKey);
                const lockerBaseKP = kpSeedToKP(values.govBaseKP);
                const govWalletBaseKP = kpSeedToKP(values.govWalletBaseKP);
                const doCreateLocker = await createLocker({
                    sdk: tribecaMut,
                    gokiSDK: sdkMut,
                    govTokenMint: new PublicKey(values.govTokenMintStr),
                    governorBaseKP: govBaseKP,
                    lockerBaseKP: lockerBaseKP,
                    owners: [emergencyDAO, ownerInvoker],
                    governanceParameters: {
                        quorumVotes: new BN(400_000_000_000000), // 400M veSBR
                        votingDelay: new BN(DAY),
                        votingPeriod: new BN(3 * DAY),
                        timelockDelaySeconds: new BN(DAY), // One day
                    },
                    lockerParams: {
                        maxStakeVoteMultiplier: 10,
                        minStakeDuration: new BN(7 * DAY),
                        maxStakeDuration: new BN(5 * 365 * DAY),
                        proposalActivationMinVotes: new BN(10_000_000_000000), // 10M veSBR,
                        whitelistEnabled: true,
                    },
                    smartWalletBaseKP: govWalletBaseKP,
                });
                for (const { title, tx } of doCreateLocker.createTXs) {
                    notify({
                        message: `${title}`,
                    });
                    const { pending, success } = await handleTX(await wrapTx(tx), title);
                    if (!success || !pending) {
                        return;
                    }
                    await pending.wait({ commitment: "confirmed" });
                }
                const subaccountTX = await sdkMut.createSubaccountInfo({
                    smartWallet: executive,
                    index: 0,
                    type: "ownerInvoker",
                });
                const { pending, success } = await handleTX(await wrapTx(subaccountTX), "Register owner invoker");
                if (!success || !pending) {
                    return;
                }
                await pending.wait({ commitment: "confirmed" });
                notify({
                    message: `DAO created successfully`,
                    description: "",
                });
                navigate(`/gov/${governorKey.toString()}`);
            }
            catch (e) {
                handleException(e, {
                    source: "custom-dao",
                });
            }
        },
    });
    const execKP = useKeypair(formik.values.execBaseKP);
    const execKey = useSmartWalletAddress(execKP?.publicKey);
    const sosKP = useKeypair(formik.values.sosBaseKP);
    const sosKey = useSmartWalletAddress(sosKP?.publicKey);
    const govWallketKP = useKeypair(formik.values.govWalletBaseKP);
    const govWalletKey = useSmartWalletAddress(govWallketKP?.publicKey);
    const govKP = useKeypair(formik.values.govBaseKP);
    const govKey = useQuery({
        queryKey: ["governorKey", govKP],
        queryFn: async () => {
            invariant(govKP);
            const [address] = await findGovernorAddress(govKP.publicKey);
            return address;
        },
        enabled: !!govKP,
    });
    const lockerKP = useKeypair(formik.values.lockerBaseKP);
    const lockerKey = useQuery({
        queryKey: ["lockerKey", lockerKP],
        queryFn: async () => {
            invariant(lockerKP);
            const [address] = await findGovernorAddress(lockerKP.publicKey);
            return address;
        },
        enabled: !!lockerKP,
    });
    return (React.createElement("div", { tw: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { tw: "mb-8" },
                React.createElement("h1", { tw: "font-bold text-2xl mb-4 dark:text-gray-50" }, "Create Custom DAO")),
            React.createElement("div", { tw: "flex flex-col w-full gap-4" },
                React.createElement("div", { tw: "flex flex-col w-full" },
                    React.createElement("form", { tw: "grid grid-cols-1 gap-6 w-full", onSubmit: formik.handleSubmit },
                        React.createElement("label", { tw: "flex flex-col", htmlFor: "govTokenMint" },
                            React.createElement("span", { tw: "text-xs mb-1" }, "Governance Token Mint"),
                            React.createElement(InputText, { id: "govTokenMintStr", name: "govTokenMintStr", type: "text", tw: "mt-1 w-full", placeholder: "Enter an address", onChange: (e) => {
                                    void formik.setFieldValue("govTokenMintStr", e.target.value);
                                }, onBlur: () => {
                                    void formik.setFieldTouched("govTokenMintStr");
                                }, value: formik.values.govTokenMintStr })),
                        React.createElement("label", { tw: "flex flex-col" },
                            React.createElement("span", { tw: "text-xs w-full mb-1" }, "Executive Council Base Keypair JSON"),
                            React.createElement(Textarea, { name: "execBaseKP", tw: "mt-1 block w-full h-24", onChange: formik.handleChange, onBlur: formik.handleBlur, value: formik.values.execBaseKP }),
                            formik.touched.execBaseKP && formik.errors.execBaseKP && (React.createElement("div", { tw: "text-red-500 text-sm mt-2" }, formik.errors.execBaseKP))),
                        React.createElement("label", null,
                            React.createElement("span", { tw: "text-xs w-full mb-1" }, "Emergency DAO Base Keypair JSON"),
                            React.createElement(Textarea, { name: "sosBaseKP", tw: "mt-1 block w-full h-24", onChange: formik.handleChange, onBlur: formik.handleBlur, value: formik.values.sosBaseKP }),
                            formik.touched.sosBaseKP && formik.errors.sosBaseKP && (React.createElement("div", { tw: "text-red-500 text-sm mt-2" }, formik.errors.sosBaseKP))),
                        React.createElement("label", null,
                            React.createElement("span", { tw: "text-xs w-full mb-1" }, "Governor Base Keypair JSON"),
                            React.createElement(Textarea, { name: "govBaseKP", tw: "mt-1 block w-full h-24", onChange: formik.handleChange, onBlur: formik.handleBlur, value: formik.values.govBaseKP }),
                            formik.touched.govBaseKP && formik.errors.govBaseKP && (React.createElement("div", { tw: "text-red-500 text-sm mt-2" }, formik.errors.govBaseKP))),
                        React.createElement("label", null,
                            React.createElement("span", { tw: "text-xs w-full mb-1" }, "Governance Wallet Base Keypair JSON"),
                            React.createElement(Textarea, { name: "govWalletBaseKP", tw: "mt-1 block w-full h-24", onChange: formik.handleChange, onBlur: formik.handleBlur, value: formik.values.govWalletBaseKP }),
                            formik.touched.govWalletBaseKP &&
                                formik.errors.govWalletBaseKP && (React.createElement("div", { tw: "text-red-500 text-sm mt-2" }, formik.errors.govWalletBaseKP))),
                        React.createElement("label", null,
                            React.createElement("span", { tw: "text-xs w-full mb-1" }, "Locker Base Keypair JSON"),
                            React.createElement(Textarea, { name: "lockerBaseKP", tw: "mt-1 block w-full h-24", onChange: formik.handleChange, onBlur: formik.handleBlur, value: formik.values.lockerBaseKP }),
                            formik.touched.lockerBaseKP && formik.errors.lockerBaseKP && (React.createElement("div", { tw: "text-red-500 text-sm mt-2" }, formik.errors.lockerBaseKP))),
                        React.createElement("div", { tw: "rounded mt-8 p-4 border" },
                            React.createElement("h3", { tw: "mb-4 uppercase text-secondary text-sm" }, "Details"),
                            React.createElement(AttributeList, { attributes: {
                                    "Executive Council Wallet": execKey.data ?? "--",
                                    "Emergency DAO Wallet": sosKey.data ?? "--",
                                    "Governance Wallet": govWalletKey.data ?? "--",
                                    Governor: govKey.data ?? "--",
                                    Locker: lockerKey.data ?? "--",
                                } })),
                        React.createElement("div", { tw: "flex mt-8 items-center justify-center " },
                            React.createElement(AsyncButton, { type: "submit", variant: "primary", size: "md", disabled: formik.isSubmitting || !formik.isValid }, "Launch DAO"))))))));
};
export default DAOCustomView;
