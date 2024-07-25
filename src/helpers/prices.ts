import { PoolData } from '../types';

export const getPoolTVL = (pool: Omit<PoolData, 'metrics'>) => {
    // Get amount token A and B, and their USD prices, and calculate TVL
    const amountTokenA = pool.exchangeInfo.reserves[0].amount;
    const amountTokenB = pool.exchangeInfo.reserves[1].amount;

    const usdPriceA = pool.usdPrice.tokenA;
    const usdPriceB = pool.usdPrice.tokenB;

    const tvl = amountTokenA.asNumber * usdPriceA + amountTokenB.asNumber * usdPriceB;
    return tvl;
};

const priceCache: Record<string, number> = {};
export const getPrice = async (mint: string, decimals: number) => {
    if (priceCache[mint]) {
        return priceCache[mint];
    }

    const result = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`).then(res => res.json());
    if (result.data[mint]) {
        Object.values(result.data).forEach((priceRecord: any) => {
            priceCache[priceRecord.id] = priceRecord.price;
        });
    } else {
        // Try using quote
        const quote = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${mint}&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${10 ** decimals}`).then(res => res.json());

        if (quote?.outAmount) {
            priceCache[mint] = parseInt(quote.outAmount) / (10 ** 6);
        } else {
            priceCache[mint] = 0;
        }
    }

    return priceCache[mint];
};
