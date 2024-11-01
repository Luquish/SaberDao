import {
  extractErrorMessage,
  useAccountData,
  useTXHandlers,
} from "@rockooor/sail";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import tw, { css } from "twin.macro";

import { useExecutiveCouncil } from "../../../../../../hooks/tribeca/useExecutiveCouncil";
import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../../hooks/tribeca/useGovernor";
import { useWrapTx } from "../../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { HelperCard } from "../../../../../common/HelperCard";
import { InputText, Textarea } from "../../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../../common/inputs/LabeledInput";
import { ProposalConfirmModal } from "./ProposalConfirmationModal";
import { ProposalTXForm } from "./ProposalTXForm";

export const ProposalCreateInner: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [discussionLink, setDiscussionLink] = useState<string>("");
  const [txRaw, setTxRaw] = useState<string>("");
  const [theError, setError] = useState<string | null>(null);
  const { minActivationThreshold, manifest } = useGovernor();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  useGovWindowTitle(`Create Proposal`);

  const proposalCfg = manifest?.proposals;
  const discussionRequired = !!proposalCfg?.discussion?.required;

  const { tx, error: parseError } = useMemo(() => {
    try {
      const buffer = Buffer.from(txRaw, "base64");
      const tx = Transaction.from(buffer);
      if (tx.instructions.length === 0) {
        return { error: "Transaction cannot be empty" };
      }
      return { tx };
    } catch (e) {
      return {
        error: extractErrorMessage(e),
      };
    }
  }, [txRaw]);

  const error =
    discussionRequired && !discussionLink
      ? "Discussion link is required"
      : proposalCfg?.discussion?.prefix &&
        !discussionLink.startsWith(proposalCfg.discussion.prefix)
      ? "Invalid discussion link"
      : theError ?? parseError;

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { ownerInvokerKey } = useExecutiveCouncil();

  // check to see if the payer is involved
  // if so, we should be showing the funding button
  const payerMut =
    !!ownerInvokerKey &&
    !!tx?.instructions
      .flatMap((ix) => ix.keys)
      .find(
        (meta) =>
          meta.pubkey.equals(ownerInvokerKey) &&
          meta.isWritable &&
          meta.isSigner
      )
      ? ownerInvokerKey
      : null;

  const { data: payerMutData } = useAccountData(payerMut);
  const currentPayerBalance =
    payerMutData === undefined
      ? undefined
      : (payerMutData?.accountInfo.lamports ?? 0) / LAMPORTS_PER_SOL;

  return (
    <>
      <ProposalConfirmModal
        isOpen={showConfirm}
        onDismiss={() => {
          setShowConfirm(false);
        }}
        proposal={{
          title,
          description: discussionLink
            ? `${description}\n\n[View Discussion](${discussionLink})`
            : description,
          instructions: tx?.instructions ?? [],
        }}
      />
      <div
        tw="flex flex-col gap-8 md:grid"
        css={css`
          grid-template-columns: 400px 1fr;
        `}
      >
        <div>
          <Card title="Proposal Info">
            <div tw="grid gap-4 px-7 py-6">
              <HelperCard variant="muted">
                <div tw="leading-loose">
                  <p tw="text-white mb-2">You are creating a proposal draft.</p>
                  <p>
                    If activated by a a DAO member with at least{" "}
                    <strong>{minActivationThreshold?.formatUnits()}</strong>,
                    the members of the DAO may vote to execute or reject the
                    proposal.
                  </p>
                </div>
              </HelperCard>
              {proposalCfg?.notice && (
                <HelperCard variant="primary">
                  <div
                    css={css`
                      p {
                        ${tw`mb-2`}
                      }
                      a {
                        ${tw`text-white`}
                        &:hover {
                          ${tw`underline`}
                        }
                      }
                    `}
                  >
                    <ReactMarkdown>{proposalCfg.notice}</ReactMarkdown>
                  </div>
                </HelperCard>
              )}
              <label tw="flex flex-col gap-1" htmlFor="title">
                <span tw="text-sm">Title (max 140 characters)</span>
                <InputText
                  id="title"
                  placeholder="A short summary of your proposal."
                  value={title}
                  maxLength={140}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label tw="flex flex-col gap-1" htmlFor="description">
                <span tw="text-sm">Description (max 750 characters)</span>
                <Textarea
                  id="description"
                  tw="h-auto"
                  rows={4}
                  maxLength={750}
                  placeholder={`## Summary\nYour proposal will be formatted using Markdown.`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              {proposalCfg?.discussion?.required && (
                <>
                  <LabeledInput
                    Component={InputText}
                    id="discussionLink"
                    required
                    label="Link to discussion (required)"
                    placeholder={`URL must start with "${
                      proposalCfg?.discussion.prefix ?? ""
                    }"`}
                    type="text"
                    value={discussionLink}
                    onChange={(e) => setDiscussionLink(e.target.value)}
                    error={
                      !discussionLink.startsWith(
                        proposalCfg.discussion.prefix ?? ""
                      )
                        ? "Invalid discussion link"
                        : undefined
                    }
                    touched={true}
                  />
                </>
              )}
            </div>
          </Card>
        </div>
        <div tw="flex flex-col gap-4">
          <Card title="Proposal Action">
            <div tw="grid gap-4 px-7 py-6">
              <ProposalTXForm
                setError={setError}
                txRaw={txRaw}
                setTxRaw={setTxRaw}
              />
            </div>
          </Card>
          <div tw="flex gap-4">
            {payerMut &&
              currentPayerBalance !== undefined &&
              currentPayerBalance < 0.5 && (
                <AsyncButton
                  tw="flex-1"
                  size="md"
                  onClick={async ({ provider }) => {
                    await signAndConfirmTX(
                      await wrapTx(
                        provider.newTX([
                          SystemProgram.transfer({
                            fromPubkey: provider.walletKey,
                            toPubkey: payerMut,
                            lamports: LAMPORTS_PER_SOL,
                          }),
                        ])
                      )
                    );
                  }}
                >
                  <div tw="flex flex-col">
                    <span>Fund with 1 SOL</span>
                    <span tw="text-xs">
                      (payer balance: {currentPayerBalance.toLocaleString()}{" "}
                      SOL)
                    </span>
                  </div>
                </AsyncButton>
              )}
            <Button
              tw="flex-1"
              size="md"
              type="button"
              disabled={!(tx && title && description) || !!error}
              variant="primary"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              {error ? error : "Preview Proposal"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
