import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import type { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { createLocker } from "@tribecahq/tribeca-sdk";
import { BN } from "bn.js";
import { useCallback, useState } from "react";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";

import { useSDK } from "@/contexts/sdk";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import type { ModalProps } from "@/components/tribeca/common/Modal";
import { Modal } from "@/components/tribeca/common/Modal";
import { TransactionPlanExecutor } from "@/components/tribeca/common/TransactionPlanExecutor";
import type { TransactionPlan } from "@/components/tribeca/common/TransactionPlanExecutor/plan";
import type { DAOParams } from "@/types/tribeca/dao/params";

interface IProps extends Omit<ModalProps, "children"> {
  daoParams: DAOParams;
  baseKP: Keypair;
  emergencyDAO: PublicKey;
  executiveCouncil: PublicKey;
  govTokenMint: PublicKey;
}

const LaunchDAOModal: React.FC<IProps> = ({
  daoParams,
  baseKP,
  emergencyDAO,
  executiveCouncil,
  govTokenMint,
  ...modalProps
}: IProps) => {
  const { data: token } = useToken(govTokenMint);
  const { sdkMut, tribecaMut } = useSDK();
  const [governorKey, setGovernorKey] = useState<PublicKey>(PublicKey.default);

  const makePlan = useCallback(async () => {
    invariant(sdkMut, "sdk");
    invariant(tribecaMut, "sdk");
    invariant(govTokenMint && executiveCouncil && emergencyDAO);

    const plan: TransactionPlan = { steps: [] };

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
        proposalActivationMinVotes: new BN(
          daoParams.proposalActivationMinVotes
        ),
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

  return (
    <Modal {...modalProps}>
      <div className="relative border-b dark:border-b-warmGray-800 dark:text-white font-bold text-base text-center py-4">
        <div className="px-8 overflow-ellipsis overflow-hidden whitespace-nowrap">
          {"Launch DAO"}
        </div>

        <div className="mb-4">
          <AttributeList
            transformLabel={false}
            attributes={
              token
                ? {
                    Token: token,
                    timelockDelaySeconds: daoParams.timelockDelaySeconds,
                    quorumVotes: new TokenAmount(token, daoParams.quorumVotes),
                    votingDelay: daoParams.votingDelay,
                    votingPeriod: daoParams.votingPeriod,
                    proposalActivationMinVotes: new TokenAmount(
                      token,
                      daoParams.proposalActivationMinVotes
                    ),
                    minStakeDuration: daoParams.minStakeDuration,
                    maxStakeDuration: daoParams.maxStakeDuration,
                    maxStakeVoteMultiplier: daoParams.maxStakeVoteMultiplier,
                  }
                : {
                    mint: govTokenMint,
                    ...daoParams,
                  }
            }
          />
        </div>
      </div>
      <TransactionPlanExecutor
        makePlan={makePlan}
        onComplete={() => {
          navigate(`/gov/${governorKey.toString()}`);
        }}
      />
    </Modal>
  );
};

export default LaunchDAOModal;