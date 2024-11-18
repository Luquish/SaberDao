import { ZERO } from "@quarryprotocol/quarry-sdk";
import { SliderHandle, SliderRange, SliderTrack } from "@reach/slider";
import { useSail, useUserATAs } from "@rockooor/sail";
import { Fraction, sleep, TokenAmount } from "@saberhq/token-utils";
import { LockerWrapper } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { formatDuration } from "date-fns";
import { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import invariant from "tiny-invariant";
import React from 'react';
import { useSDK } from "@/contexts/sdk";
import { useLocker, useUserEscrow, } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useParseTokenAmount } from "@/hooks/tribeca/useParseTokenAmount";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { tsToDate } from "@/utils/tribeca/utils";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Button } from "@/components/tribeca/common/Button";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { HelperCard } from "@/components/tribeca/common/HelperCard";
import { InputSlider } from "@/components/tribeca/common/inputs/InputSlider";
import { InputTokenAmount } from "@/components/tribeca/common/inputs/InputTokenAmount";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { Modal } from "@/components/tribeca/common/Modal";
import { ModalInner } from "@/components/tribeca/common/Modal/ModalInner";
const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;
const normalizeDuration = (seconds) => {
    if (seconds >= ONE_YEAR) {
        return {
            years: Math.floor(seconds / ONE_YEAR) || undefined,
            days: Math.floor((seconds % ONE_YEAR) / ONE_DAY) || undefined,
        };
    }
    if (seconds >= ONE_DAY) {
        return {
            days: Math.floor(seconds / ONE_DAY) || undefined,
        };
    }
    if (seconds >= ONE_HOUR) {
        return {
            hours: Math.floor(seconds / ONE_HOUR),
        };
    }
    if (seconds >= ONE_MINUTE) {
        return {
            minutes: Math.floor(seconds / ONE_MINUTE),
        };
    }
    return {
        seconds,
    };
};
const nicePresets = (minLockupSeconds, maxLockupSeconds) => {
    const result = [];
    if (minLockupSeconds < ONE_DAY) {
        result.push(ONE_MINUTE);
        result.push(ONE_HOUR);
    }
    if (maxLockupSeconds > ONE_DAY * 30) {
        result.push(ONE_DAY * 30);
    }
    if (maxLockupSeconds > ONE_YEAR) {
        result.push(ONE_YEAR);
    }
    return [minLockupSeconds, ...result, maxLockupSeconds].map((seconds) => ({
        seconds,
        duration: normalizeDuration(seconds),
    }));
};
export const LockEscrowModal = ({ variant, ...modalProps }) => {
    const { tribecaMut } = useSDK();
    const { governor, veToken, govToken, lockerData } = useGovernor();
    const { data: locker } = useLocker();
    const { data: escrow, refetch } = useUserEscrow();
    const [userBalance] = useUserATAs(govToken);
    const [lockDurationSeconds, setDurationSeconds] = useState(lockerData?.account.params.minStakeDuration.toString() ?? "");
    const parsedDurationSeconds = lockDurationSeconds
        ? parseFloat(lockDurationSeconds)
        : null;
    useEffect(() => {
        if (lockerData && parsedDurationSeconds === null) {
            setDurationSeconds(lockerData.account.params.minStakeDuration.toString());
        }
    }, [lockerData, parsedDurationSeconds]);
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const durations = locker
        ? [
            locker.account.params.minStakeDuration.toNumber(),
            locker.account.params.maxStakeDuration.toNumber(),
        ]
        : locker;
    const durationPresets = durations
        ? nicePresets(durations[0], durations[1])
        : [];
    const [depositAmountStr, setDepositAmountStr] = useState("0");
    const depositAmount = useParseTokenAmount(govToken, depositAmountStr);
    const prevUnlockTime = escrow ? tsToDate(escrow.escrow.escrowEndsAt) : null;
    const unlockTime = parsedDurationSeconds
        ? new Date(Date.now() + parsedDurationSeconds * 1_000)
        : null;
    const isInvalidUnlockTime = prevUnlockTime && unlockTime && unlockTime < prevUnlockTime;
    const currentVotingPower = veToken
        ? new TokenAmount(veToken, escrow ? escrow.calculateVotingPower(Date.now() / 1_000) : 0)
        : null;
    const newDeposits = govToken
        ? new TokenAmount(govToken, escrow?.escrow?.amount ?? 0).add(new TokenAmount(govToken, depositAmount?.raw ?? 0))
        : null;
    const newVotingPower = newDeposits && locker && veToken && parsedDurationSeconds
        ? new TokenAmount(veToken, new Fraction(newDeposits.raw)
            .multiply(locker.account.params.maxStakeVoteMultiplier)
            .multiply(parsedDurationSeconds)
            .divide(locker.account.params.maxStakeDuration).quotient)
        : null;
    return (React.createElement(Modal, { className: "p-0 dark:text-white", ...modalProps },
        React.createElement(ModalInner, { className: "p-0", title: variant === "extend" ? "Extend Lockup" : "Lock Tokens" },
            React.createElement("div", { className: "px-8 py-4" },
                React.createElement("div", { className: "flex flex-col gap-8" },
                    variant === "extend" && (React.createElement(HelperCard, null,
                        React.createElement("p", null, "Extend your lockup to increase the voting power of your current token stake."))),
                    variant === "lock" && (React.createElement(InputTokenAmount, { tokens: [], label: "Deposit Amount", token: govToken ?? null, inputValue: depositAmountStr, inputOnChange: setDepositAmountStr, currentAmount: {
                            amount: userBalance?.balance,
                            allowSelect: true,
                        } })),
                    React.createElement("div", null,
                        React.createElement("div", { className: "flex flex-col gap-2" },
                            React.createElement("span", { className: "font-medium text-sm" }, "Lock Period"),
                            React.createElement("div", { className: `text-4xl my-6 h-12 ${isInvalidUnlockTime ? "text-red-500" : ""}` }, parsedDurationSeconds ? (formatDuration(normalizeDuration(parsedDurationSeconds))) : (React.createElement(ContentLoader, { className: "h-8 w-16" }))),
                            React.createElement("div", { className: "w-11/12 mx-auto my-4" },
                                React.createElement(InputSlider, { value: parsedDurationSeconds ?? undefined, min: durations?.[0], max: durations?.[1], step: 1, onChange: (e) => setDurationSeconds(e.toFixed(2)) },
                                    React.createElement(SliderTrack, null,
                                        React.createElement(SliderRange, null),
                                        React.createElement(SliderHandle, null)))),
                            React.createElement("div", { className: "flex gap-4 mx-auto mt-4 flex-wrap" }, durationPresets.map(({ duration, seconds }, i) => (React.createElement(Button, { key: i, variant: "outline", className: "px-4 rounded border-primary hover:border-primary bg-primary bg-opacity-20", onClick: () => {
                                    setDurationSeconds(seconds.toString());
                                } }, formatDuration(duration))))),
                            React.createElement("div", { className: "py-6 flex items-center justify-center" },
                                React.createElement(FaArrowDown, null)),
                            React.createElement("div", { className: "mb-6 border rounded border-warmGray-800" }, !veToken ? (React.createElement("div", { className: "w-full py-5 flex items-center justify-center" },
                                React.createElement(LoadingSpinner, { className: "h-8 w-8" }))) : (React.createElement(AttributeList, { className: "items-start gap-4", transformLabel: false, attributes: {
                                    [`${veToken.symbol} balance`]: (React.createElement("div", { className: "flex flex-col" },
                                        React.createElement("div", null,
                                            React.createElement("span", { className: "text-warmGray-400" }, "Prev: "),
                                            React.createElement("span", null, currentVotingPower?.toExact({
                                                groupSeparator: ",",
                                            }))),
                                        React.createElement("div", null,
                                            React.createElement("span", { className: "text-warmGray-400" }, "Next: "),
                                            React.createElement("span", null, newVotingPower?.toExact({
                                                groupSeparator: ",",
                                            }))))),
                                    "Unlock Time": (React.createElement("div", { className: "flex flex-col" },
                                        React.createElement("div", null,
                                            React.createElement("span", { className: "text-warmGray-400" }, "Prev: "),
                                            React.createElement("span", null, prevUnlockTime?.toLocaleString(undefined, {
                                                timeZoneName: "short",
                                            }) ?? "n/a")),
                                        React.createElement("div", null,
                                            React.createElement("span", { className: "text-warmGray-400" }, "Next: "),
                                            React.createElement("span", null, unlockTime?.toLocaleString(undefined, {
                                                timeZoneName: "short",
                                            }) ?? "--")))),
                                } }))),
                            isInvalidUnlockTime && (React.createElement(HelperCard, { variant: "error", className: "my-4" },
                                React.createElement("div", { className: "py-2" },
                                    React.createElement("h2", { className: "text-base text-white mb-2 font-semibold" }, "You cannot decrease your lock period"),
                                    React.createElement("p", { className: "mb-1" },
                                        "Your existing lock period ends at",
                                        " ",
                                        prevUnlockTime.toLocaleString(),
                                        ". Any updates to your vote escrow must result in a lockup that ends at or after this date."),
                                    React.createElement("p", null, "You may use a separate wallet in order to maintain multiple lockups of varying expiries.")))),
                            React.createElement(Button, { size: "md", variant: "primary", disabled: !tribecaMut ||
                                    !locker ||
                                    !!isInvalidUnlockTime ||
                                    !parsedDurationSeconds ||
                                    !depositAmount ||
                                    (variant !== "extend" && depositAmount.toU64().isZero()), onClick: async () => {
                                    invariant(tribecaMut &&
                                        locker &&
                                        parsedDurationSeconds &&
                                        depositAmount);
                                    const lockerW = new LockerWrapper(tribecaMut, locker.publicKey, governor);
                                    const tx = await lockerW.lockTokens({
                                        amount: variant === "extend" ? ZERO : depositAmount.toU64(),
                                        duration: new BN(parsedDurationSeconds),
                                    });
                                    const { pending, success } = await handleTX(await wrapTx(tx), `Lock tokens`);
                                    if (!pending || !success) {
                                        return;
                                    }
                                    await pending.wait();
                                    await sleep(1_000);
                                    await refetch();
                                    modalProps.onDismiss();
                                } }, isInvalidUnlockTime
                                ? "Cannot decrease lock time"
                                : variant === "extend"
                                    ? "Extend Lockup"
                                    : "Lock Tokens"))))))));
};
