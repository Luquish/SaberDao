import { VoteSide } from "@tribecahq/tribeca-sdk";
import { sum } from "lodash-es";
import invariant from "tiny-invariant";
import React from 'react';

import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { FORMAT_VOTE_PERCENT } from "@/utils/tribeca/format";
import { HelperCard } from "@/components/tribeca/common/HelperCard";
import { Textarea } from "@/components/tribeca/common/inputs/InputText";
import { Meter } from "@/components/tribeca/common/Meter";
import { sideColor } from "@/pages/tribeca/governance/utils/voting";
import { VOTE_SIDE_LABEL } from "../VotesCard";

interface Props {
  proposal: ProposalInfo;
  side: VoteSide | null;
  setSide: (side: VoteSide) => void;
  reason: string;
  setReason: (reason: string) => void;
}

export const VoteSelectContents: React.FC<Props> = ({
  proposal,
  side,
  setSide,
  reason,
  setReason,
}: Props) => {
  const allVotes = (["forVotes", "againstVotes", "abstainVotes"] as const).map(
    (vote) => proposal.proposalData[vote].toNumber()
  );
  const totalVotes = sum(allVotes);
  return (
    <div className="grid gap-4">
      <div className="flex flex-col items-center text-white font-semibold">
        <h2>Your Ballot for Proposal #{proposal.index}</h2>
      </div>
      <HelperCard variant="muted">
        <p>Select one of the options below to cast your vote.</p>
      </HelperCard>
      <div className="w-full flex flex-col gap-4 text-sm">
        {([VoteSide.For, VoteSide.Against, VoteSide.Abstain] as const).map(
          (voteSide, i) => {
            const myVotes = allVotes[i];
            invariant(typeof myVotes === "number");
            const percent = FORMAT_VOTE_PERCENT.format(
              totalVotes === 0 ? 0 : myVotes / totalVotes
            );
            return (
              <button
                className={`flex items-center gap-4 px-5 py-4 border rounded border-warmGray-600 transition-all ${
                  side === voteSide ? `border-[${sideColor(voteSide)}]` : ''
                }`}
                key={voteSide}
                onClick={() => setSide(voteSide)}
              >
                <div>
                  <div className="border border-gray-500 w-6 h-6">
                    <svg
                      className="w-full h-full"
                      style={{
                        strokeWidth: '15px',
                        fill: 'none',
                      }}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {voteSide === VoteSide.For ? (
                        <path
                          d="M 10 50 L 40 86 L 90 10"
                          strokeDasharray="140"
                          strokeDashoffset={side === voteSide ? "0" : "140"}
                          style={{
                            stroke: sideColor(voteSide),
                            transition: 'stroke-dashoffset 0.1s ease-in 0s'
                          }}
                        ></path>
                      ) : (
                        <>
                          <path
                            d="M 10 10 L 90 90"
                            strokeDasharray="113"
                            strokeDashoffset={side === voteSide ? "0" : "113"}
                            style={{
                              stroke: sideColor(voteSide),
                              transition: 'stroke-dashoffset 0.1s ease-in 0s'
                            }}
                          ></path>
                          <path
                            d="M 90 10 L 10 90"
                            strokeDasharray="113"
                            strokeDashoffset={side === voteSide ? "0" : "113"}
                            style={{
                              stroke: sideColor(voteSide),
                              transition: 'stroke-dashoffset 0.1s ease-in 0s'
                            }}
                          ></path>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-white font-medium">
                      {VOTE_SIDE_LABEL[voteSide]}
                    </div>
                    <div className="text-warmGray-400 font-medium">{percent}</div>
                  </div>
                  <Meter
                    className="w-full"
                    value={myVotes}
                    max={totalVotes === 0 ? 1 : totalVotes}
                    barColor={sideColor(voteSide)}
                  />
                </div>
              </button>
            );
          }
        )}
      </div>
      <div className="mt-8">
        <label htmlFor="reason" className="flex flex-col gap-2">
          <span className="font-medium text-white text-sm">
            Add Reason (max 200 characters)
          </span>
          <Textarea
            id="reason"
            className="resize-none h-auto"
            maxLength={200}
            placeholder="Tell others why you are voting this way"
            rows={4}
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};
