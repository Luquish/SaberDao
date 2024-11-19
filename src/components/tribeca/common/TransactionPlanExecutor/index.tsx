import {
  SailSignAndConfirmError,
  useSail,
  useTXHandlers,
} from "@rockooor/sail";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import invariant from "tiny-invariant";
import React from "react";

import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { Button } from "@/components/tribeca/common/Button";
import ContentLoader from "@/components/tribeca/common/ContentLoader";
import LoadingSpinner from "@/components/tribeca/common/LoadingSpinner";
import type { TransactionPlan } from "./plan";

interface Props {
  makePlan: () => Promise<TransactionPlan>;
  onComplete?: () => void;
}

export const TransactionPlanExecutor: React.FC<Props> = ({
  makePlan,
  onComplete,
}: Props) => {
  const { handleTXs } = useSail();
  const { wrapTx } = useWrapTx();
  const { signAndConfirmTXs } = useTXHandlers();
  const [nextTX, setNextTX] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const [plan, setPlan] = useState<TransactionPlan | null>(null);
  useEffect(() => {
    if (plan) {
      return;
    }
    void (async () => {
      const plan = await makePlan();
      setPlan(plan);
    })();
  }, [makePlan, plan]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-white">
        You are about to execute the following transactions:
      </p>
      {plan ? (
        <div className="text-sm flex flex-col border border-warmGray-800 rounded w-full">
          {plan.steps.map(({ title, txs }, i) => {
            const errorMsg = i === nextTX ? error : null;
            return (
              <div
                key={i}
                className="flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800"
              >
                <div>
                  {title}
                  {txs.length > 1 ? ` (${txs.length} TXs)` : ""}
                </div>
                <div className="flex w-3/12 justify-center mr-4">
                  {i < nextTX ? (
                    <FaCheckCircle className="text-primary" />
                  ) : i === nextTX && pending ? (
                    <LoadingSpinner />
                  ) : (
                    <Button
                      variant={errorMsg ? "secondary" : "outline"}
                      disabled={i !== nextTX}
                      onClick={async () => {
                        setError(null);
                        const { pending, success, errors } = await handleTXs(
                          await wrapTx(txs),
                          title
                        );
                        if (!success) {
                          setError(
                            errors?.map((err: Error) => err.message).join(", ") ??
                              "Error"
                          );
                          return;
                        }
                        try {
                          await Promise.all(pending.map((p: { wait: () => Promise<unknown> }) => p.wait()));
                        } catch (e) {
                          const error = e as Error;
                          setError(error.message);
                          return;
                        }

                        if (i === plan.steps.length - 1) {
                          onComplete?.();
                        } else {
                          setNextTX((n) => n + 1);
                        }
                      }}
                    >
                      {errorMsg ? "Retry" : "Execute"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm flex flex-col border border-warmGray-800 rounded w-full">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800"
              >
                <ContentLoader className="w-12 h-4" />
                <ContentLoader className="w-4 h-4" />
              </div>
            ))}
        </div>
      )}
      <Button
        variant="primary"
        size="md"
        disabled={!plan}
        onClick={async () => {
          invariant(plan);
          for (const tx of plan.steps.slice(nextTX)) {
            if (tx.txs.length === 0) {
              continue;
            }
            setError(null);
            setPending(true);
            try {
              await signAndConfirmTXs(await wrapTx(tx.txs), tx.title);
            } catch (e: unknown) {
              if (e instanceof SailSignAndConfirmError) {
                setError(
                  e.errors?.map((err: Error) => err.message).join(", ") ?? "Error"
                );
              } else if (e instanceof Error) {
                setError(e.message);
              } else {
                setError("Unknown Error");
              }
              setPending(false);
              return;
            }
            setNextTX((n) => n + 1);
          }
          setPending(false);
          onComplete?.();
        }}
      >
        Execute All
      </Button>
    </div>
  );
};
