import {
  DEFAULT_LOCKER_PARAMS,
  DEFAULT_QUORUM_VOTES,
  DEFAULT_VOTE_DELAY,
  DEFAULT_VOTE_PERIOD,
} from "@tribecahq/tribeca-sdk";
import { BN } from "bn.js";
import * as Yup from "yup";

export interface DAOParams {
  // Govern params
  timelockDelaySeconds: string;
  quorumVotes: string;
  votingDelay: string;
  votingPeriod: string;
  // Locker Params
  proposalActivationMinVotes: string;
  minStakeDuration: string;
  maxStakeDuration: string;
  maxStakeVoteMultiplier: number;
}

export const DEFAULT_DAO_PARAMS: DAOParams = {
  timelockDelaySeconds: new BN(1).toString(),
  quorumVotes: DEFAULT_QUORUM_VOTES.toString(),
  votingDelay: DEFAULT_VOTE_DELAY.toString(),
  votingPeriod: DEFAULT_VOTE_PERIOD.toString(),
  proposalActivationMinVotes:
    DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes.toString(),
  minStakeDuration: DEFAULT_LOCKER_PARAMS.minStakeDuration.toString(),
  maxStakeDuration: DEFAULT_LOCKER_PARAMS.maxStakeDuration.toString(),
  maxStakeVoteMultiplier: DEFAULT_LOCKER_PARAMS.maxStakeVoteMultiplier,
};

export const DAOParamsFormSchema = Yup.object().shape({
  timelockDelaySeconds: Yup.string().required(),
  quorumVotes: Yup.string().required(),
  votingDelay: Yup.string().required(),
  votingPeriod: Yup.string().required(),
  proposalActivationMinVotes: Yup.string().required(),
  minStakeDuration: Yup.string().required(),
  maxStakeDuration: Yup.string().required(),
  maxStakeVoteMultiplier: Yup.number().required(),
});
