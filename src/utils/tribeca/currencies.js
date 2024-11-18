import { mapValues } from "lodash-es";
/**
 * A market
 */
export var CurrencyMarket;
(function (CurrencyMarket) {
    CurrencyMarket["USD"] = "USD";
    CurrencyMarket["BTC"] = "BTC";
    CurrencyMarket["LUNA"] = "LUNA";
    CurrencyMarket["FTT"] = "FTT";
    CurrencyMarket["SRM"] = "SRM";
    CurrencyMarket["SOL"] = "SOL";
})(CurrencyMarket || (CurrencyMarket = {}));
export const getMarketTag = (market) => `saber-market-${market.toString().toLocaleLowerCase()}`;
export const CURRENCY_MARKET_TAGS = mapValues(CurrencyMarket, (value) => getMarketTag(value));
export const getMarketFromTag = (tag) => {
    return (Object.entries(CURRENCY_MARKET_TAGS).find(([_, v]) => v === tag)?.[0] ?? null);
};
export const getMarket = (token) => {
    const marketTag = token.info.tags?.find((tag) => tag.startsWith("saber-market-"));
    if (!marketTag) {
        return CurrencyMarket.USD;
    }
    return getMarketFromTag(marketTag) ?? CurrencyMarket.USD;
};
export const getMarketIfExists = (token) => {
    const marketTag = token.info.tags?.find((tag) => tag.startsWith("saber-market-"));
    if (!marketTag) {
        return null;
    }
    return getMarketFromTag(marketTag) ?? null;
};
/**
 * Default options for formatting the currency in large amounts.
 */
export const CURRENCY_INFO = {
    USD: {
        name: "Stablecoin",
        symbol: "USD",
        prefix: "%",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 0,
        }),
    },
    BTC: {
        name: "Bitcoin",
        symbol: "BTC",
        prefix: "₿",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 8,
        }),
    },
    LUNA: {
        name: "Luna",
        symbol: "LUNA",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 2,
        }),
    },
    FTT: {
        name: "FTT",
        symbol: "FTT",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 4,
        }),
    },
    SRM: {
        name: "SRM",
        symbol: "SRM",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 3,
        }),
    },
    SOL: {
        name: "SOL",
        symbol: "SOL",
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 3,
        }),
    },
};
