import { SailSignAndConfirmError, useSail, useTXHandlers, } from "@rockooor/sail";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import invariant from "tiny-invariant";
import React from "react";
import { useWrapTx } from "../../../../hooks/tribeca/useWrapTx";
import { Button } from "../Button";
import { ContentLoader } from "../ContentLoader";
import { LoadingSpinner } from "../LoadingSpinner";
export const TransactionPlanExecutor = ({ makePlan, onComplete, }) => {
    const { handleTXs } = useSail();
    const { wrapTx } = useWrapTx();
    const { signAndConfirmTXs } = useTXHandlers();
    const [nextTX, setNextTX] = useState(0);
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(false);
    const [plan, setPlan] = useState(null);
    useEffect(() => {
        if (plan) {
            return;
        }
        void (async () => {
            const plan = await makePlan();
            setPlan(plan);
        })();
    }, [makePlan, plan]);
    return (React.createElement("div", { className: "flex flex-col gap-4 items-center" },
        React.createElement("p", { className: "text-white" }, "You are about to execute the following transactions:"),
        plan ? (React.createElement("div", { className: "text-sm flex flex-col border border-warmGray-800 rounded w-full" }, plan.steps.map(({ title, txs }, i) => {
            const errorMsg = i === nextTX ? error : null;
            return (React.createElement("div", { key: i, className: "flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800" },
                React.createElement("div", null,
                    title,
                    txs.length > 1 ? ` (${txs.length} TXs)` : ""),
                React.createElement("div", { className: "flex w-3/12 justify-center mr-4" }, i < nextTX ? (React.createElement(FaCheckCircle, { className: "text-primary" })) : i === nextTX && pending ? (React.createElement(LoadingSpinner, null)) : (React.createElement(Button, { variant: errorMsg ? "secondary" : "outline", disabled: i !== nextTX, onClick: async () => {
                        setError(null);
                        const { pending, success, errors } = await handleTXs(await wrapTx(txs), title);
                        if (!success) {
                            setError(errors?.map((err) => err.message).join(", ") ??
                                "Error");
                            return;
                        }
                        try {
                            await Promise.all(pending.map((p) => p.wait()));
                        }
                        catch (e) {
                            const error = e;
                            setError(error.message);
                            return;
                        }
                        if (i === plan.steps.length - 1) {
                            onComplete?.();
                        }
                        else {
                            setNextTX((n) => n + 1);
                        }
                    } }, errorMsg ? "Retry" : "Execute")))));
        }))) : (React.createElement("div", { className: "text-sm flex flex-col border border-warmGray-800 rounded w-full" }, Array(3)
            .fill(null)
            .map((_, i) => (React.createElement("div", { key: i, className: "flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800" },
            React.createElement(ContentLoader, { className: "w-12 h-4" }),
            React.createElement(ContentLoader, { className: "w-4 h-4" })))))),
        React.createElement(Button, { variant: "primary", size: "md", disabled: !plan, onClick: async () => {
                invariant(plan);
                for (const tx of plan.steps.slice(nextTX)) {
                    if (tx.txs.length === 0) {
                        continue;
                    }
                    setError(null);
                    setPending(true);
                    try {
                        await signAndConfirmTXs(await wrapTx(tx.txs), tx.title);
                    }
                    catch (e) {
                        if (e instanceof SailSignAndConfirmError) {
                            setError(e.errors?.map((err) => err.message).join(", ") ?? "Error");
                        }
                        else if (e instanceof Error) {
                            setError(e.message);
                        }
                        else {
                            setError("Unknown Error");
                        }
                        setPending(false);
                        return;
                    }
                    setNextTX((n) => n + 1);
                }
                setPending(false);
                onComplete?.();
            } }, "Execute All")));
};
