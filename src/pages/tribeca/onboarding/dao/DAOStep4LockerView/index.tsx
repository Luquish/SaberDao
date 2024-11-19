import React, { useState, ChangeEvent } from 'react';
import { Keypair } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { FaDice } from "react-icons/fa";
import invariant from "tiny-invariant";
import { usePubkey } from "@rockooor/sail";

import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { Button } from "@/components/tribeca/common/Button";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import LabeledInput from "@/components/tribeca/common/inputs/LabeledInput";
import Section from "@/components/tribeca/layout/WalletLayout/Section";
import LaunchDAOModal from "./LaunchDAOModal";
import type { DAOParams } from "@/types/tribeca/dao/params";
import { DAOParamsFormSchema, DEFAULT_DAO_PARAMS } from "@/types/tribeca/dao/params";
import { findGovernorAddress, findLockerAddress } from "@tribecahq/tribeca-sdk";

const DAOStep4LockerView: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const executiveStr = params.get("executive");
  const emergencyStr = params.get("emergency");
  const executive = usePubkey(executiveStr);
  const emergencyDAO = usePubkey(emergencyStr);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [daoParams, setDaoParams] = useState<DAOParams>(DEFAULT_DAO_PARAMS);
  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());
  const [govTokenMintStr, setGovTokenMintStr] = useState<string>("");
  const govTokenMint = usePubkey(govTokenMintStr);

  const { data: keys } = useQuery({
    queryKey: ["lockedVoterKeys", baseKP?.publicKey.toString()],
    queryFn: async () => {
      invariant(baseKP);
      const [governor] = await findGovernorAddress(baseKP.publicKey);
      const [locker] = await findLockerAddress(baseKP.publicKey);
      return { governor, locker };
    },
    enabled: !!baseKP,
  });

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    isSubmitting,
    isValid,
  } = useFormik<DAOParams>({
    initialValues: DEFAULT_DAO_PARAMS,
    validationSchema: DAOParamsFormSchema,
    onSubmit: (values: DAOParams) => {
      setDaoParams(values);
      setShowModal(true);
    },
  });

  const governorKey = keys?.governor;
  const lockerKey = keys?.locker;

  const renderParamsForm = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Section title="Set Govern Params">
          <div>
            <LabeledInput
              className="mb-1.5"
              Component={InputText}
              id="timelockDelaySeconds"
              label="Timelock Delay (in seconds)"
              type="text"
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.timelockDelaySeconds}
              touched={touched.timelockDelaySeconds}
            />
            <LabeledInput
              className="mb-1.5"
              Component={InputText}
              id="quorumVotes"
              label="Quorum Votes (include decimals)"
              type="text"
              value={values.quorumVotes}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.quorumVotes}
              touched={touched.quorumVotes}
            />
            <LabeledInput
              className="mb-1.5"
              id="votingDelay"
              Component={InputText}
              label="Voting Delay (in seconds)"
              type="text"
              value={values.votingDelay}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.votingDelay}
              touched={touched.votingDelay}
            />
            <LabeledInput
              className="mb-1.5"
              id="votingPeriod"
              Component={InputText}
              label="Voting Period (in seconds)"
              type="text"
              value={values.votingPeriod}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.votingPeriod}
              touched={touched.votingPeriod}
            />
          </div>
        </Section>
        <Section title="Set Locker Params">
          <div>
            <LabeledInput
              className="mb-1.5"
              id="maxStakeVoteMultiplier"
              Component={InputText}
              label="Max Stake Vote Multiplier"
              type="number"
              value={values.maxStakeVoteMultiplier}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.maxStakeVoteMultiplier}
              touched={touched.maxStakeVoteMultiplier}
            />
            <LabeledInput
              className="mb-1.5"
              id="proposalActivationMinVotes"
              Component={InputText}
              label="Min Votes for Proposal Activation (include decimals)"
              type="text"
              value={values.proposalActivationMinVotes}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.proposalActivationMinVotes}
              touched={touched.proposalActivationMinVotes}
            />
            <LabeledInput
              className="mb-1.5"
              id="minStakeDuration"
              Component={InputText}
              label="Min Stake Duration (in seconds)"
              type="text"
              value={values.minStakeDuration}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.minStakeDuration}
              touched={touched.minStakeDuration}
            />
            <LabeledInput
              className="mb-1.5"
              id="maxStakeDuration"
              Component={InputText}
              label="Max Stake Duration (in seconds)"
              type="text"
              value={values.maxStakeDuration}
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.maxStakeDuration}
              touched={touched.maxStakeDuration}
            />
          </div>
        </Section>
      </div>
    );
  };

  const handleGovTokenMintChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGovTokenMintStr(e.target.value);
  };

  return (
    <>
      {isValid && emergencyDAO && executive && govTokenMint && (
        <LaunchDAOModal
          isOpen={showModal}
          onDismiss={() => setShowModal(false)}
          daoParams={daoParams}
          baseKP={baseKP}
          emergencyDAO={emergencyDAO}
          executiveCouncil={executive}
          govTokenMint={govTokenMint}
        />
      )}
      <div className="grid gap-12 w-full max-w-sm mx-auto">
        <div>
          <div className="mb-8">
            <h1 className="font-bold text-3xl mb-4 dark:text-gray-50">
              Create the DAO
            </h1>
            <h2 className="text-secondary font-medium text-sm dark:text-gray-300">
              Launch your Tribeca DAO by providing a governance token.
            </h2>
          </div>
          <div className="flex flex-col gap-16">
            <div className="grid gap-4">
              <label className="flex flex-col" htmlFor="govTokenMint">
                <span className="text-xs mb-1">Governance Token Mint</span>
                <InputText
                  id="govTokenMint"
                  className="h-10"
                  value={govTokenMintStr}
                  onChange={handleGovTokenMintChange}
                />
              </label>
              <div className="flex flex-col w-full">
                <span className="text-xs mb-1.5">Governor Address</span>
                <div className="flex gap-2 w-full">
                  <InputText
                    className="h-10 flex-grow"
                    disabled
                    value={governorKey?.toString()}
                  />
                  <Button
                    className="flex items-center gap-2 h-10"
                    onClick={() => {
                      setBaseKP(Keypair.generate());
                    }}
                  >
                    <span>Reroll</span>
                    <FaDice />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs mb-1.5">Locker Address</span>
                <div className="flex gap-2 w-full">
                  <InputText
                    className="h-10 flex-grow"
                    disabled
                    value={lockerKey?.toString()}
                  />
                  <Button
                    className="flex items-center gap-2 h-10"
                    onClick={() => {
                      setBaseKP(Keypair.generate());
                    }}
                  >
                    <span>Reroll</span>
                    <FaDice />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs mb-1">Executive Multisig</span>
                <InputText className="h-10" disabled value={executive?.toString()} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs mb-1">Emergency Multisig</span>
                <InputText
                  className="h-10"
                  disabled
                  value={emergencyDAO?.toString()}
                />
              </div>
            </div>
            {renderParamsForm()}
            <div className="mx-auto flex flex-col items-center gap-6">
              <AsyncButton
                type="submit"
                className="w-[200px]"
                variant="primary"
                size="md"
                disabled={
                  !govTokenMint ||
                  !executive ||
                  !emergencyDAO ||
                  isSubmitting ||
                  !isValid
                }
                onClick={() => handleSubmit()}
              >
                Submit
              </AsyncButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DAOStep4LockerView;
