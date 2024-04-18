const DEPRECATED_POOL_NAMES = [
    'aaDAI-USDC',
    'aaUSDC-USDC',
    'aaUSDT-USDT',
    'aaWBTC-renBTC',
    'abBTCB-renBTC',
    'abBUSD-USDC',
    'abETH-ETH',
    'abUSDC-USDC',
    'abUSDT-USDT',
    'acEUR-agEUR',
    'acUSD-USDC',
    'acUSD-CASH',
    'USDC-acUSDC',
    'aeDAI-USDC',
    'ETH-aeWETH',
    'aeUSDC-USDC',
    'aeUSDT-USDT',
    'afBTC-renBTC',
    'afDAI-USDC',
    'afETH-ETH',
    'afUSDC-USDC',
    'ahUSDT-USDC',
    'ahBTC-renBTC',
    'apUSDC-USDC',
    'apUSDT-USDT',
    'atUST-CASH',
    'atLUNA-LUNA',
    'TRYB-TRYB',
    'BTC-renBTC',
    'wBUSD_v1-USDC',
    'CUSD-USDC',
    'calUSD-USDC',
    'CASH-USDC',
    'wDAI_v1-USDC',
    'USDC-fUSD',
    'aeFEI-CASH',
    'aeFEI-UST',
    'wFRAX_v1-USDC',
    'FRAX-CASH',
    'FRAX-UST',
    'wFTT_v1-soFTT',
    'wHBTC_v1-renBTC',
    'wHUSD_v1-USDC',
    'wibBTC_V1-BTC',
    'wibBTC_V1-renBTC',
    'wLUNA_v1-renLUNA',
    'aeMIM-CASH',
    'aeMIM-UST',
    'NIRV-USDC',
    'NIRV-USDH',
    'NIRV-USDT',
    'NIRV-UST',
    'PAI-CASH',
    'pBTC-renBTC',
    'pUSDT-pUSDC',
    'soFTT-FTT',
    'solUST-UST',
    'solUST-USDH',
    'wSRM_V1-SRM',
    'stSOL-SOL',
    'stSOL-mSOL',
    'PAI-USDC',
    'USDC-SECRET',
    'USDH-USDCet',
    'USDH-CASH',
    'USDH-UST',
    'wUSDK_V1-USDC',
    'USH-USDC',
    'USN-USDC',
    'wUST_v1-USDC',
    'UST-CASH',
    'UXD-CASH',
    'BUSDbs-USDC',
    'USDCbs-USDC',
    'USDTbs-USDT',
    'DAI-USDC',
    'BUSDet-USDC',
    'USDCet-USDC',
    'USDTet-USDT',
    'FRAX-USDC',
    'aeFTT-FTT',
    'HBTC-renBTC',
    'soETH-ETH',
    'HUSD-USDC',
    'wibBTC-renBTC',
    'LUNA-renLUNA',
    'SRMet-SRM',
    'USDK-USDC',
    'UST-USDC',
    'xBTC-renBTC',
    'xETH-ETH',
    'xFTT-FTT',
    'xLUNA-LUNA',
    'xSOL-SOL',
    'xUSD-USDC',
    'aSOL-SOL',
    'eSOL-SOL',
    'MAI-USDC',
    'cSOL-cmSOL',
    'cUSDC-cUSDT',
    'prtSOL-SOL',
    'pSOL-prtSOL',
];

export const isPoolDeprecated = (poolName: string) => {
    return DEPRECATED_POOL_NAMES.includes(poolName);
};
