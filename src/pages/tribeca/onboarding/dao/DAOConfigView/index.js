import { findOwnerInvokerAddress, findSmartWallet } from "@gokiprotocol/client";
import { useKeypair, usePubkey, useSail, useToken } from "@rockooor/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { createLocker, findGovernorAddress } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSDK } from "../../../../../contexts/sdk";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Textarea } from "../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../common/inputs/LabeledInput";
import { DAOConfigRenderer } from "./DAOConfigRenderer";
export const DAOConfigView = () => {
    const { sdkMut, tribecaMut } = useSDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const [configStr, setConfigStr] = useState("");
    const configRaw = useMemo(() => {
        try {
            return JSON.parse(configStr);
        }
        catch (e) {
            return null;
        }
    }, [configStr]);
    const { data: token } = useToken(usePubkey(configRaw?.governor.token_mint));
    const config = useMemo(() => {
        if (!token || !configRaw) {
            return null;
        }
        return {
            executiveCouncil: new PublicKey(configRaw.executive_council),
            emergencyDao: new PublicKey(configRaw.emergency_dao),
            governor: {
                quorumVotes: configRaw.governor.quorum_votes,
                token,
                votingDelay: configRaw.governor.voting_delay,
                votingPeriod: configRaw.governor.voting_period,
                timelockDelay: configRaw.governor.timelock_delay,
            },
            locker: {
                maxStakeVoteMultiplier: configRaw.locker.max_stake_vote_multiplier,
                minStakeDuration: configRaw.locker.min_stake_duration,
                maxStakeDuration: configRaw.locker.max_stake_duration,
                proposalActivationMinVotes: configRaw.locker.proposal_activation_min_votes,
                whitelistEnabled: configRaw.locker.whitelist_enabled,
            },
        };
    }, [configRaw, token]);
    const navigate = useNavigate();
    const [govBaseKP, setGovBaseKP] = useState(JSON.stringify([...Keypair.generate().secretKey]));
    const govKP = useKeypair(govBaseKP);
    const { data: govKey } = useQuery({
        queryKey: ["governorKey", govKP],
        queryFn: async () => {
            invariant(govKP);
            const [address] = await findGovernorAddress(govKP.publicKey);
            return address;
        },
        enabled: !!govKP,
    });
    const [lockerBaseKP, setLockerBaseKP] = useState(JSON.stringify([...Keypair.generate().secretKey]));
    const lockerKP = useKeypair(lockerBaseKP);
    const { data: lockerKey } = useQuery({
        queryKey: ["lockerKey", lockerKP],
        queryFn: async () => {
            invariant(lockerKP);
            const [address] = await findGovernorAddress(lockerKP.publicKey);
            return address;
        },
        enabled: !!lockerKP,
    });
    const [govWalletBaseKP, setGovWalletBaseKP] = useState(JSON.stringify([...Keypair.generate().secretKey]));
    const govWalletKP = useKeypair(govWalletBaseKP);
    const { data: govWalletKey } = useQuery({
        queryKey: ["govWalletKey", govWalletKP],
        queryFn: async () => {
            invariant(govWalletKP);
            const [address] = await findSmartWallet(govWalletKP.publicKey);
            return address;
        },
        enabled: !!govWalletKP,
    });
    return (React.createElement("div", { tw: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { tw: "mb-8" },
                React.createElement("h1", { tw: "font-bold text-2xl mb-4 dark:text-gray-50" }, "Create Custom DAO")),
            React.createElement("div", { tw: "flex flex-col w-full gap-4" },
                React.createElement("div", { tw: "flex flex-col w-full" },
                    React.createElement(LabeledInput, { id: "config", Component: Textarea, label: "Configuration JSON", value: configStr, onChange: (e) => setConfigStr(e.target.value) }),
                    React.createElement(LabeledInput, { id: "govBaseKP", Component: Textarea, label: "Governor Base KP", value: govBaseKP, onChange: (e) => setGovBaseKP(e.target.value) }),
                    React.createElement(LabeledInput, { id: "lockerBaseKP", Component: Textarea, label: "Locker Base KP", value: lockerBaseKP, onChange: (e) => setLockerBaseKP(e.target.value) }),
                    React.createElement(LabeledInput, { id: "govWalletBaseKP", Component: Textarea, label: "Gov Wallet Base KP", value: govWalletBaseKP, onChange: (e) => setGovWalletBaseKP(e.target.value) }),
                    config && (React.createElement(DAOConfigRenderer, { config: config, addresses: {
                            govWallet: govWalletKey,
                            gov: govKey,
                            locker: lockerKey,
                        } })),
                    React.createElement("div", { tw: "flex mt-8 items-center justify-center " },
                        React.createElement(AsyncButton, { type: "submit", variant: "primary", size: "md", onClick: async () => {
                                invariant(config);
                                invariant(sdkMut, "sdk");
                                invariant(tribecaMut, "sdk");
                                invariant(govKP && lockerKP && govWalletKP && govKey, "sdk");
                                const [ownerInvoker] = await findOwnerInvokerAddress(config.executiveCouncil, 0);
                                const doCreateLocker = await createLocker({
                                    sdk: tribecaMut,
                                    gokiSDK: sdkMut,
                                    govTokenMint: config.governor.token.mintAccount,
                                    governorBaseKP: govKP,
                                    lockerBaseKP: lockerKP,
                                    owners: [config.emergencyDao, ownerInvoker],
                                    governanceParameters: {
                                        quorumVotes: new BN(config.governor.quorumVotes),
                                        votingDelay: new BN(config.governor.votingDelay),
                                        votingPeriod: new BN(config.governor.votingPeriod),
                                        timelockDelaySeconds: new BN(config.governor.timelockDelay),
                                    },
                                    lockerParams: {
                                        maxStakeVoteMultiplier: config.locker.maxStakeVoteMultiplier,
                                        minStakeDuration: new BN(config.locker.minStakeDuration),
                                        maxStakeDuration: new BN(config.locker.maxStakeDuration),
                                        proposalActivationMinVotes: new BN(config.locker.proposalActivationMinVotes),
                                        whitelistEnabled: config.locker.whitelistEnabled,
                                    },
                                    smartWalletBaseKP: govWalletKP,
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
                                    smartWallet: config.executiveCouncil,
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
                                navigate(`/gov/${govKey.toString()}`);
                            } }, "Launch DAO")))))));
};
export default DAOConfigView;
