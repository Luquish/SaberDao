import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { createLocker } from "@tribecahq/tribeca-sdk";
import { BN } from "bn.js";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSDK } from "../../../../../contexts/sdk";
import { AttributeList } from "../../../../common/AttributeList";
import { Modal } from "../../../../common/Modal";
import { TransactionPlanExecutor } from "../../../../common/TransactionPlanExecutor";
export const LaunchDAOModal = ({ daoParams, baseKP, emergencyDAO, executiveCouncil, govTokenMint, ...modalProps }) => {
    const navigate = useNavigate();
    const { data: token } = useToken(govTokenMint);
    const { sdkMut, tribecaMut } = useSDK();
    const [governorKey, setGovernorKey] = useState(PublicKey.default);
    const makePlan = useCallback(async () => {
        invariant(sdkMut, "sdk");
        invariant(tribecaMut, "sdk");
        invariant(govTokenMint && executiveCouncil && emergencyDAO);
        const plan = { steps: [] };
        const doCreateLocker = await createLocker({
            sdk: tribecaMut,
            gokiSDK: sdkMut,
            govTokenMint,
            governorBaseKP: baseKP,
            lockerBaseKP: baseKP,
            owners: [emergencyDAO, executiveCouncil],
            governanceParameters: {
                quorumVotes: new BN(daoParams.quorumVotes),
                votingDelay: new BN(daoParams.votingDelay),
                votingPeriod: new BN(daoParams.votingPeriod),
                timelockDelaySeconds: new BN(daoParams.timelockDelaySeconds),
            },
            lockerParams: {
                maxStakeVoteMultiplier: daoParams.maxStakeVoteMultiplier,
                maxStakeDuration: new BN(daoParams.maxStakeDuration),
                minStakeDuration: new BN(daoParams.minStakeDuration),
                proposalActivationMinVotes: new BN(daoParams.proposalActivationMinVotes),
            },
        });
        doCreateLocker.createTXs.forEach(({ title, tx }) => {
            plan.steps.push({ title, txs: [tx] });
        });
        setGovernorKey(doCreateLocker.governorWrapper.governorKey);
        return plan;
    }, [
        baseKP,
        daoParams,
        emergencyDAO,
        executiveCouncil,
        govTokenMint,
        sdkMut,
        tribecaMut,
    ]);
    return (React.createElement(Modal, { ...modalProps },
        React.createElement("div", { tw: "relative border-b dark:border-b-warmGray-800 dark:text-white font-bold text-base text-center py-4" },
            React.createElement("div", { tw: "px-8 overflow-ellipsis overflow-hidden whitespace-nowrap" }, "Launch DAO"),
            React.createElement("div", { tw: "mb-4" },
                React.createElement(AttributeList, { transformLabel: false, attributes: token
                        ? {
                            Token: token,
                            timelockDelaySeconds: daoParams.timelockDelaySeconds,
                            quorumVotes: new TokenAmount(token, daoParams.quorumVotes),
                            votingDelay: daoParams.votingDelay,
                            votingPeriod: daoParams.votingPeriod,
                            proposalActivationMinVotes: new TokenAmount(token, daoParams.proposalActivationMinVotes),
                            minStakeDuration: daoParams.minStakeDuration,
                            maxStakeDuration: daoParams.maxStakeDuration,
                            maxStakeVoteMultiplier: daoParams.maxStakeVoteMultiplier,
                        }
                        : {
                            mint: govTokenMint,
                            ...daoParams,
                        } }))),
        React.createElement(TransactionPlanExecutor, { makePlan: makePlan, onComplete: () => {
                navigate(`/gov/${governorKey.toString()}`);
            } })));
};
