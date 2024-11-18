import { useRewarder } from "@rockooor/react-quarry";
import { PublicKey } from "@solana/web3.js";
import { mapValues } from "lodash-es";
import { useCallback, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { useAllGauges } from "../hooks/useGauges";
import { useMyGauges } from "../hooks/useMyGauges";
const useUpdateGaugeWeightsInternal = () => {
    const { quarries } = useRewarder();
    const { gaugeVoter } = useMyGauges();
    const { escrowKey } = useUserEscrow();
    const { gaugeKeys } = useAllGauges();
    const [nextSharesRaw, setNextSharesRaw] = useState({});
    const setTokenShareStr = useCallback((farmKey, currentShare, value) => {
        setNextSharesRaw((subs) => ({
            ...subs,
            [farmKey.toString()]: { currentShare, value },
        }));
    }, []);
    const sharesDiff = useMemo(() => {
        return Object.entries(nextSharesRaw)
            .map(([stakedTokenMintStr, { currentShare: prevShare, value: nextShare },]) => {
            const quarryInfo = quarries?.find((quarry) => quarry.quarry.account.tokenMintKey.equals(new PublicKey(stakedTokenMintStr)));
            const quarry = quarryInfo?.quarry;
            if (!quarry || !quarryInfo) {
                return null;
            }
            if (prevShare.toString() !== nextShare) {
                const prevShareParsed = prevShare;
                let nextShareParsed = null;
                try {
                    nextShareParsed = nextShare === "" ? 0 : parseInt(nextShare);
                    // filter out empty changesets
                    if (nextShareParsed === prevShare) {
                        return null;
                    }
                    // eslint-disable-next-line no-empty
                }
                catch (e) { }
                return {
                    quarryInfo,
                    quarry,
                    prevShare: prevShare.toString(),
                    nextShare,
                    prevShareParsed,
                    nextShareParsed,
                };
            }
            return null;
        })
            .filter((x) => !!x);
    }, [nextSharesRaw, quarries]);
    const isDiffValid = useMemo(() => {
        return !sharesDiff.find((diff) => !diff.nextShare);
    }, [sharesDiff]);
    const currentTotalShares = gaugeVoter?.account.totalWeight ?? 0;
    const nextTotalShares = useMemo(() => {
        return sharesDiff.reduce((acc, diff) => {
            if (diff.nextShareParsed !== null) {
                return acc + diff.nextShareParsed - diff.prevShareParsed;
            }
            return acc;
        }, currentTotalShares);
    }, [currentTotalShares, sharesDiff]);
    const nextShares = useMemo(() => {
        return mapValues(nextSharesRaw, (amt) => {
            try {
                const parsedAmt = parseInt(amt.value);
                if (Number.isNaN(parsedAmt)) {
                    return null;
                }
                return parsedAmt;
            }
            catch (e) {
                return null;
            }
        });
    }, [nextSharesRaw]);
    return {
        nextShares,
        nextSharesRaw,
        setTokenShareStr,
        sharesDiff,
        isDiffValid,
        currentTotalShares,
        nextTotalShares,
        escrowKey,
        gaugeKeys: gaugeKeys ?? [],
    };
};
export const { useContainer: useUpdateGaugeWeights, Provider: UpdateGaugeWeightsProvider, } = createContainer(useUpdateGaugeWeightsInternal);
