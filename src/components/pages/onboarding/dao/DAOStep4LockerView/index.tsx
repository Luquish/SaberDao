import { usePubkey } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { findGovernorAddress, findLockerAddress } from "@tribecahq/tribeca-sdk";
import { useFormik } from "formik";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import invariant from "tiny-invariant";

import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../common/inputs/LabeledInput";
import { Section } from "../../../../layout/WalletLayout/Section";
import { LaunchDAOModal } from "./LaunchDAOModal";
import type { DAOParams } from "./params";
import { DAOParamsFormSchema, DEFAULT_DAO_PARAMS } from "./params";

export const DAOStep4LockerView: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const executiveStr = urlParams.get("executive");
  const emergencyStr = urlParams.get("emergency");
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
    onSubmit: (values) => {
      setDaoParams(values);
      setShowModal(true);
    },
  });

  const governorKey = keys?.governor;
  const lockerKey = keys?.locker;

  const renderParamsForm = () => {
    return (
      <div tw="grid grid-cols-2 gap-4">
        <Section title="Set Govern Params">
          <div>
            <LabeledInput
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
              tw="mb-1.5"
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
      <div tw="grid gap-12 w-full max-w-sm mx-auto">
        <div>
          <div tw="mb-8">
            <h1 tw="font-bold text-3xl mb-4 dark:text-gray-50">
              Create the DAO
            </h1>
            <h2 tw="text-secondary font-medium text-sm dark:text-gray-300">
              Launch your Tribeca DAO by providing a governance token.
            </h2>
          </div>
          <div tw="flex flex-col gap-16">
            <div tw="grid gap-4">
              <label tw="flex flex-col" htmlFor="govTokenMint">
                <span tw="text-xs mb-1">Governance Token Mint</span>
                <InputText
                  id="govTokenMint"
                  tw="h-10"
                  value={govTokenMintStr}
                  onChange={(e) => setGovTokenMintStr(e.target.value)}
                />
              </label>
              <div tw="flex flex-col w-full">
                <span tw="text-xs mb-1.5">Governor Address</span>
                <div tw="flex gap-2 w-full">
                  <InputText
                    tw="h-10 flex-grow"
                    disabled
                    value={governorKey?.toString()}
                  />
                  <Button
                    tw="flex items-center gap-2 h-10"
                    onClick={() => {
                      setBaseKP(Keypair.generate());
                    }}
                  >
                    <span>Reroll</span>
                    <FaDice />
                  </Button>
                </div>
              </div>
              <div tw="flex flex-col w-full">
                <span tw="text-xs mb-1.5">Locker Address</span>
                <div tw="flex gap-2 w-full">
                  <InputText
                    tw="h-10 flex-grow"
                    disabled
                    value={lockerKey?.toString()}
                  />
                  <Button
                    tw="flex items-center gap-2 h-10"
                    onClick={() => {
                      setBaseKP(Keypair.generate());
                    }}
                  >
                    <span>Reroll</span>
                    <FaDice />
                  </Button>
                </div>
              </div>
              <div tw="flex flex-col">
                <span tw="text-xs mb-1">Executive Multisig</span>
                <InputText tw="h-10" disabled value={executive?.toString()} />
              </div>
              <div tw="flex flex-col">
                <span tw="text-xs mb-1">Emergency Multisig</span>
                <InputText
                  tw="h-10"
                  disabled
                  value={emergencyDAO?.toString()}
                />
              </div>
            </div>
            {renderParamsForm()}
            <div tw="mx-auto flex flex-col items-center gap-6">
              <AsyncButton
                type="submit"
                tw="w-[200px]"
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
