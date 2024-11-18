import React, { useEffect, useMemo, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { getLogo, getPoolId, getPoolName } from '../helpers/pool';
import H1 from '../components/H1';
import usePoolsInfo from '../hooks/usePoolsInfo';
import Table from '../components/Table';
import LoadingText from '../components/LoadingText';
import { Button } from '../components/tribeca/common/Button';
import Input, { InputType } from '../components/Input';
import ActiveText from '../components/ActiveText';
import PoolSwitch, { PoolsView } from '../components/PoolSwitch';
import { CurrencyMarket } from '../types';
import { toAPY, toPrecision } from '../helpers/number';
import useGetPrices from '../hooks/useGetPrices';
import useGetStats from '../hooks/useGetStats';
import useDeprecatedPools from '../hooks/useDeprecatedPools';
import useFeaturedPools from '../hooks/useFeaturedPools';
const KNOWN_GROUPS = [
    CurrencyMarket.USD,
    CurrencyMarket.BTC,
    CurrencyMarket.SOL,
    CurrencyMarket.ETH,
];
var SORTS;
(function (SORTS) {
    SORTS["DEFAULT"] = "DEFAULT";
    SORTS["VOLUME_ASC"] = "VOLUME_ASC";
    SORTS["VOLUME_DESC"] = "VOLUME_DESC";
    SORTS["APY_ASC"] = "APY_ASC";
    SORTS["APY_DESC"] = "APY_DESC";
    SORTS["TVL_ASC"] = "TVL_ASC";
    SORTS["TVL_DESC"] = "TVL_DESC";
})(SORTS || (SORTS = {}));
const sortReadable = {
    [SORTS.DEFAULT]: 'Default',
    [SORTS.VOLUME_DESC]: 'Volume (desc)',
    [SORTS.VOLUME_ASC]: 'Volume (asc)',
    [SORTS.TVL_DESC]: 'TVL (desc)',
    [SORTS.TVL_ASC]: 'TVL (asc)',
    [SORTS.APY_DESC]: 'APY (desc)',
    [SORTS.APY_ASC]: 'APY (asc)',
};
const sortFunctions = {
    [SORTS.DEFAULT]: (a, b) => {
        if ((a.userInfo?.stakedUsdValue ?? 0) > (b.userInfo?.stakedUsdValue ?? 0)) {
            return -1;
        }
        if ((a.userInfo?.stakedUsdValue ?? 0) < (b.userInfo?.stakedUsdValue ?? 0)) {
            return 1;
        }
        return (a.metrics?.tvl ?? 0) - (b.metrics?.tvl ?? 0) > 0 ? -1 : 1;
    },
    [SORTS.VOLUME_DESC]: (a, b) => {
        return (a.metricInfo?.v ?? 0) > (b.metricInfo?.v ?? 0) ? -1 : 1;
    },
    [SORTS.VOLUME_ASC]: (a, b) => {
        return (a.metricInfo?.v ?? 0) > (b.metricInfo?.v ?? 0) ? 1 : -1;
    },
    [SORTS.TVL_DESC]: (a, b) => {
        return (a.metrics?.tvl ?? 0) > (b.metrics?.tvl ?? 0) ? -1 : 1;
    },
    [SORTS.TVL_ASC]: (a, b) => {
        return (a.metrics?.tvl ?? 0) > (b.metrics?.tvl ?? 0) ? 1 : -1;
    },
    [SORTS.APY_DESC]: (a, b) => {
        return (a.metrics?.totalApy ?? 0) > (b.metrics?.totalApy ?? 0) ? -1 : 1;
    },
    [SORTS.APY_ASC]: (a, b) => {
        return (a.metrics?.totalApy ?? 0) > (b.metrics?.totalApy ?? 0) ? 1 : -1;
    },
};
const IndexPage = () => {
    const pools = usePoolsInfo();
    const { data: price } = useGetPrices();
    const { data: sbrStats } = useGetStats();
    const { wallet } = useWallet();
    const [sort, setSort] = useState(SORTS.DEFAULT);
    const { data: deprecatedPools } = useDeprecatedPools();
    const { data: featuredPools } = useFeaturedPools();
    const { watch, register, resetField } = useForm();
    const poolsView = useReadLocalStorage('poolsView');
    const header = {
        data: [
            'Name',
            wallet?.adapter.publicKey ? (React.createElement("div", { key: "header-volume", className: "flex items-center" },
                React.createElement("div", { className: "flex-grow" }, "Your deposits"),
                poolsView !== PoolsView.GRID && (React.createElement("div", { className: "hidden lg:block" },
                    sort !== SORTS.DEFAULT && (React.createElement(FaSort, { className: "cursor-pointer", onClick: () => setSort(SORTS.DEFAULT) })),
                    sort == SORTS.DEFAULT && React.createElement(FaSortDown, null))))) : undefined,
            React.createElement("div", { key: "header-volume", className: "flex items-center" },
                React.createElement("div", { className: "flex-grow" }, "TVL"),
                poolsView !== PoolsView.GRID && (React.createElement("div", { className: "cursor-pointer hidden lg:block" },
                    sort !== SORTS.TVL_ASC && sort !== SORTS.TVL_DESC && (React.createElement(FaSort, { onClick: () => setSort(SORTS.TVL_DESC) })),
                    sort == SORTS.TVL_DESC && (React.createElement(FaSortDown, { onClick: () => setSort(SORTS.TVL_ASC) })),
                    sort == SORTS.TVL_ASC && (React.createElement(FaSortUp, { onClick: () => setSort(SORTS.TVL_DESC) }))))),
            React.createElement("div", { key: "header-volume", className: "flex items-center" },
                React.createElement("div", { className: "flex-grow" }, "Volume 24h"),
                poolsView !== PoolsView.GRID && (React.createElement("div", { className: "cursor-pointer hidden lg:block" },
                    sort !== SORTS.VOLUME_ASC && sort !== SORTS.VOLUME_DESC && (React.createElement(FaSort, { onClick: () => setSort(SORTS.VOLUME_DESC) })),
                    sort == SORTS.VOLUME_DESC && (React.createElement(FaSortDown, { onClick: () => setSort(SORTS.VOLUME_ASC) })),
                    sort == SORTS.VOLUME_ASC && (React.createElement(FaSortUp, { onClick: () => setSort(SORTS.VOLUME_DESC) }))))),
            React.createElement("div", { key: "header-volume", className: "flex items-center" },
                React.createElement("div", { className: "flex-grow" }, "APY"),
                poolsView !== PoolsView.GRID && (React.createElement("div", { className: "cursor-pointer hidden lg:block" },
                    sort !== SORTS.APY_ASC && sort !== SORTS.APY_DESC && (React.createElement(FaSort, { onClick: () => setSort(SORTS.APY_DESC) })),
                    sort == SORTS.APY_DESC && (React.createElement(FaSortDown, { onClick: () => setSort(SORTS.APY_ASC) })),
                    sort == SORTS.APY_ASC && (React.createElement(FaSortUp, { onClick: () => setSort(SORTS.APY_DESC) }))))),
            ' ',
        ].filter(Boolean),
    };
    const filterText = watch('filterText');
    const filterCurrency = watch('filterCurrency');
    const filterDeprecated = watch('filterDeprecated');
    const filterMyPools = watch('filterMyPools');
    const sortDropdown = watch('sortDropdown');
    const sortDropdownMobile = watch('sortDropdownMobile');
    useEffect(() => {
        setSort(sortDropdown || sortDropdownMobile);
    }, [sortDropdown, sortDropdownMobile]);
    const data = useMemo(() => {
        if (pools.data && price) {
            return [
                header,
                ...pools.data.pools
                    .filter((pool) => {
                    if (filterText &&
                        !getPoolName(pool.info.name).toLowerCase().includes(filterText.toLowerCase())) {
                        return false;
                    }
                    if (filterCurrency && pool.info.currency !== filterCurrency) {
                        return false;
                    }
                    if (!filterDeprecated && deprecatedPools?.includes(pool.info.name)) {
                        return false;
                    }
                    if (!filterDeprecated && !featuredPools?.includes(pool.info.name) && !filterText) {
                        return false;
                    }
                    if (filterMyPools &&
                        wallet?.adapter.publicKey &&
                        (pool.userInfo?.stakedUsdValue ?? 0) === 0) {
                        return false;
                    }
                    return true;
                })
                    .sort(sortFunctions[sort || SORTS.DEFAULT])
                    .map((pool) => {
                    return {
                        rowLink: `/pools/${getPoolId(pool.info.id)}`,
                        data: [
                            React.createElement("div", { key: getPoolId(pool.info.id), className: "flex items-center gap-2" },
                                React.createElement("img", { className: "w-5 h-5 rounded-full", src: getLogo(pool.info.tokens[0].symbol, pool.info.tokenIcons[0].logoURI) }),
                                React.createElement("img", { className: "-ml-3 w-5 h-5 rounded-full", src: getLogo(pool.info.tokens[1].symbol, pool.info.tokenIcons[1].logoURI) }),
                                deprecatedPools?.includes(pool.info.name) ? (React.createElement("p", { className: "line-through" }, getPoolName(pool.info.name))) : (getPoolName(pool.info.name))),
                            wallet?.adapter.publicKey && pool.userInfo?.stakedUsdValue
                                ? `$${toPrecision(pool.userInfo.stakedUsdValue, 4)}`
                                : wallet?.adapter.publicKey
                                    ? ' '
                                    : '',
                            `$${toPrecision(pool.metrics?.tvl ?? 0, 4)}`,
                            pool.metricInfo?.v
                                ? `$${toPrecision(pool.metricInfo.v, 4)}`
                                : '$0',
                            `${toAPY(pool.metrics?.totalApy ?? 0, 4)}%`,
                            React.createElement(React.Fragment, null, poolsView !== PoolsView.GRID && (React.createElement("div", { className: "flex justify-end" },
                                React.createElement(Button, { className: "hidden lg:inline-block", key: "button" }, "View")))),
                        ].filter(Boolean),
                    };
                }),
            ];
        }
        return [header, ...new Array(5).fill({ data: new Array(5).fill(React.createElement(LoadingText, null)) })];
    }, [pools, wallet]);
    const stats = useMemo(() => {
        return {
            tvl: pools.data?.pools.reduce((acc, pool) => {
                return acc + (pool.metrics?.tvl ?? 0);
            }, 0) ?? 0,
            volume: pools.data?.pools.reduce((acc, pool) => {
                return acc + (pool.metricInfo?.v ?? 0);
            }, 0) ?? 0,
            fee: pools.data?.pools.reduce((acc, pool) => {
                return acc + (pool.metricInfo?.feesUsd ?? 0);
            }, 0) ?? 0,
        };
    }, [pools]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("div", { className: "mt-3 mb-6" },
                React.createElement(H1, null, "Saber global stats"),
                React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 bg-saber-dark/20 rounded-lg p-3 gap-1" },
                    React.createElement("div", { className: "font-bold" }, "TVL"),
                    React.createElement("div", null, `$${toPrecision(stats.tvl, 4)}`),
                    React.createElement("div", { className: "font-bold" }, "24h volume"),
                    React.createElement("div", null, `$${toPrecision(stats.volume, 4)}`),
                    React.createElement("div", { className: "font-bold" }, "24h fees"),
                    React.createElement("div", null, `$${toPrecision(stats.fee, 4)}`),
                    React.createElement("div", { className: "font-bold" }, "Total SBR supply"),
                    React.createElement("div", null, `${toPrecision(sbrStats?.totalSupply ?? 0, 4)}`),
                    React.createElement("div", { className: "font-bold" }, "SBR circulating"),
                    React.createElement("div", null, `${toPrecision(sbrStats?.circulatingSupply ?? 0, 4)}`),
                    React.createElement("div", { className: "font-bold" }, "veSBR supply"),
                    React.createElement("div", null, `${toPrecision(sbrStats?.vesbr ?? 0, 4)}`))),
            React.createElement("div", { className: "block lg:flex items-center mb-3" },
                React.createElement("div", { className: "flex-grow" },
                    React.createElement(H1, null, "Pools")),
                React.createElement("div", { className: "flex flex-wrap justify-end items-center gap-3" },
                    poolsView === PoolsView.GRID && (React.createElement(Input, { type: InputType.DROPDOWN, register: register('sortDropdown'), placeholder: "Sort by", values: Object.values(SORTS).map((group) => {
                            // Return as [key, human readable value]
                            return [group, sortReadable[group]];
                        }) })),
                    React.createElement("div", { className: "block lg:hidden" },
                        React.createElement(Input, { type: InputType.DROPDOWN, register: register('sortDropdownMobile'), placeholder: "Sort by", values: Object.values(SORTS).map((group) => {
                                // Return as [key, human readable value]
                                return [group, sortReadable[group]];
                            }) })),
                    !filterCurrency ? (React.createElement(Input, { type: InputType.DROPDOWN, register: register('filterCurrency'), placeholder: "Currency", values: Object.values(KNOWN_GROUPS).map((group) => {
                            // Return as [key, human readable value]
                            return [group, group];
                        }) })) : (React.createElement(ActiveText, null,
                        React.createElement("div", { className: "cursor-pointer text-slate-200 rounded-lg text-sm py-2 px-3 flex items-center gap-1 group transition-colors", onClick: () => resetField('filterCurrency') },
                            filterCurrency,
                            React.createElement(ImCross, { className: "group-hover:text-saber-light transition-colors" })))),
                    React.createElement(Input, { type: InputType.TEXT, register: register('filterText'), placeholder: "Filter pool..." }),
                    wallet?.adapter.publicKey && (React.createElement(Input, { type: InputType.CHECKBOX, register: register('filterMyPools'), label: "My deposits" })),
                    React.createElement(Input, { type: InputType.CHECKBOX, register: register('filterDeprecated'), label: "Show all" }),
                    React.createElement("div", { className: "hidden lg:block" },
                        React.createElement(PoolSwitch, null)))),
            React.createElement(Table, { data: data, blockView: poolsView === PoolsView.GRID }))));
};
export default IndexPage;
export const Head = () => React.createElement("title", null, "Saber | Solana AMM");
