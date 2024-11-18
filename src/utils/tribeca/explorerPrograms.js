import { BPF_LOADER_DEPRECATED_PROGRAM_ID, BPF_LOADER_PROGRAM_ID, Ed25519Program, Secp256k1Program, StakeProgram, SystemProgram, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, SYSVAR_REWARDS_PUBKEY, SYSVAR_STAKE_HISTORY_PUBKEY, VOTE_PROGRAM_ID, } from "@solana/web3.js";
import { mapValues } from "lodash-es";
export var Cluster;
(function (Cluster) {
    Cluster[Cluster["MainnetBeta"] = 0] = "MainnetBeta";
    Cluster[Cluster["Testnet"] = 1] = "Testnet";
    Cluster[Cluster["Devnet"] = 2] = "Devnet";
    Cluster[Cluster["Custom"] = 3] = "Custom";
})(Cluster || (Cluster = {}));
export var PROGRAM_NAMES;
(function (PROGRAM_NAMES) {
    // native built-ins
    PROGRAM_NAMES["ADDRESS_MAP"] = "Address Map Program";
    PROGRAM_NAMES["CONFIG"] = "Config Program";
    PROGRAM_NAMES["STAKE"] = "Stake Program";
    PROGRAM_NAMES["SYSTEM"] = "System Program";
    PROGRAM_NAMES["VOTE"] = "Vote Program";
    // native precompiles
    PROGRAM_NAMES["SECP256K1"] = "Secp256k1 SigVerify Precompile";
    PROGRAM_NAMES["ED25519"] = "Ed25519 SigVerify Precompile";
    // spl
    PROGRAM_NAMES["ASSOCIATED_TOKEN"] = "Associated Token Program";
    PROGRAM_NAMES["FEATURE_PROPOSAL"] = "Feature Proposal Program";
    PROGRAM_NAMES["LENDING"] = "Lending Program";
    PROGRAM_NAMES["MEMO"] = "Memo Program";
    PROGRAM_NAMES["MEMO_2"] = "Memo Program v2";
    PROGRAM_NAMES["NAME"] = "Name Service Program";
    PROGRAM_NAMES["STAKE_POOL"] = "Stake Pool Program";
    PROGRAM_NAMES["SWAP"] = "Swap Program";
    PROGRAM_NAMES["TOKEN"] = "Token Program";
    PROGRAM_NAMES["TOKEN_METADATA"] = "Token Metadata Program";
    PROGRAM_NAMES["TOKEN_VAULT"] = "Token Vault Program";
    // other
    PROGRAM_NAMES["ACUMEN"] = "Acumen Program";
    PROGRAM_NAMES["BONFIDA_POOL"] = "Bonfida Pool Program";
    PROGRAM_NAMES["BREAK_SOLANA"] = "Break Solana Program";
    PROGRAM_NAMES["MANGO_GOVERNANCE"] = "Mango Governance Program";
    PROGRAM_NAMES["MANGO_ICO"] = "Mango ICO Program";
    PROGRAM_NAMES["MANGO_1"] = "Mango Program v1";
    PROGRAM_NAMES["MANGO_2"] = "Mango Program v2";
    PROGRAM_NAMES["MANGO_3"] = "Mango Program v3";
    PROGRAM_NAMES["MARINADE"] = "Marinade Staking Program";
    PROGRAM_NAMES["MERCURIAL"] = "Mercurial Stable Swap Program";
    PROGRAM_NAMES["METAPLEX"] = "Metaplex Program";
    PROGRAM_NAMES["NFT_AUCTION"] = "NFT Auction Program";
    PROGRAM_NAMES["NFT_CANDY_MACHINE"] = "NFT Candy Machine Program";
    PROGRAM_NAMES["ORCA_SWAP_1"] = "Orca Swap Program v1";
    PROGRAM_NAMES["ORCA_SWAP_2"] = "Orca Swap Program v2";
    PROGRAM_NAMES["ORCA_AQUAFARM"] = "Orca Aquafarm Program";
    PROGRAM_NAMES["PORT"] = "Port Finance Program";
    PROGRAM_NAMES["PYTH_DEVNET"] = "Pyth Oracle Program";
    PROGRAM_NAMES["PYTH_TESTNET"] = "Pyth Oracle Program";
    PROGRAM_NAMES["PYTH_MAINNET"] = "Pyth Oracle Program";
    PROGRAM_NAMES["QUARRY_MERGE_MINE"] = "Quarry Merge Mine";
    PROGRAM_NAMES["QUARRY_MINE"] = "Quarry Mine";
    PROGRAM_NAMES["QUARRY_MINT_WRAPPER"] = "Quarry Mint Wrapper";
    PROGRAM_NAMES["QUARRY_REDEEMER"] = "Quarry Redeemer";
    PROGRAM_NAMES["QUARRY_REGISTRY"] = "Quarry Registry";
    PROGRAM_NAMES["RAYDIUM_AMM"] = "Raydium AMM Program";
    PROGRAM_NAMES["RAYDIUM_IDO"] = "Raydium IDO Program";
    PROGRAM_NAMES["RAYDIUM_LP_1"] = "Raydium Liquidity Pool Program v1";
    PROGRAM_NAMES["RAYDIUM_LP_2"] = "Raydium Liquidity Pool Program v2";
    PROGRAM_NAMES["RAYDIUM_STAKING"] = "Raydium Staking Program";
    PROGRAM_NAMES["SABER_ROUTER"] = "Saber Router Program";
    PROGRAM_NAMES["SABER_SWAP"] = "Saber Stable Swap Program";
    PROGRAM_NAMES["SERUM_1"] = "Serum Dex Program v1";
    PROGRAM_NAMES["SERUM_2"] = "Serum Dex Program v2";
    PROGRAM_NAMES["SERUM_3"] = "Serum Dex Program v3";
    PROGRAM_NAMES["SERUM_SWAP"] = "Serum Swap Program";
    PROGRAM_NAMES["SOLEND"] = "Solend Program";
    PROGRAM_NAMES["SOLIDO"] = "Lido for Solana Program";
    PROGRAM_NAMES["STEP_SWAP"] = "Step Finance Swap Program";
    PROGRAM_NAMES["SWIM_SWAP"] = "Swim Swap Program";
    PROGRAM_NAMES["SWITCHBOARD"] = "Switchboard Oracle Program";
    PROGRAM_NAMES["WORMHOLE"] = "Wormhole";
})(PROGRAM_NAMES || (PROGRAM_NAMES = {}));
const ALL_CLUSTERS = [
    Cluster.Custom,
    Cluster.Devnet,
    Cluster.Testnet,
    Cluster.MainnetBeta,
];
const LIVE_CLUSTERS = [Cluster.Devnet, Cluster.Testnet, Cluster.MainnetBeta];
export const PROGRAM_INFO_BY_ID = {
    // native built-ins
    AddressMap111111111111111111111111111111111: {
        name: PROGRAM_NAMES.ADDRESS_MAP,
        deployments: ALL_CLUSTERS,
    },
    Config1111111111111111111111111111111111111: {
        name: PROGRAM_NAMES.CONFIG,
        deployments: ALL_CLUSTERS,
    },
    [StakeProgram.programId.toBase58()]: {
        name: PROGRAM_NAMES.STAKE,
        deployments: ALL_CLUSTERS,
    },
    [SystemProgram.programId.toBase58()]: {
        name: PROGRAM_NAMES.SYSTEM,
        deployments: ALL_CLUSTERS,
    },
    [VOTE_PROGRAM_ID.toBase58()]: {
        name: PROGRAM_NAMES.VOTE,
        deployments: ALL_CLUSTERS,
    },
    // native precompiles
    [Secp256k1Program.programId.toBase58()]: {
        name: PROGRAM_NAMES.SECP256K1,
        deployments: ALL_CLUSTERS,
    },
    [Ed25519Program.programId.toBase58()]: {
        name: PROGRAM_NAMES.ED25519,
        deployments: ALL_CLUSTERS,
    },
    // spl
    ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: {
        name: PROGRAM_NAMES.ASSOCIATED_TOKEN,
        deployments: ALL_CLUSTERS,
    },
    Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse: {
        name: PROGRAM_NAMES.FEATURE_PROPOSAL,
        deployments: ALL_CLUSTERS,
    },
    LendZqTs7gn5CTSJU1jWKhKuVpjJGom45nnwPb2AMTi: {
        name: PROGRAM_NAMES.LENDING,
        deployments: LIVE_CLUSTERS,
    },
    Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo: {
        name: PROGRAM_NAMES.MEMO,
        deployments: ALL_CLUSTERS,
    },
    MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr: {
        name: PROGRAM_NAMES.MEMO_2,
        deployments: ALL_CLUSTERS,
    },
    namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX: {
        name: PROGRAM_NAMES.NAME,
        deployments: LIVE_CLUSTERS,
    },
    SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy: {
        name: PROGRAM_NAMES.STAKE_POOL,
        deployments: LIVE_CLUSTERS,
    },
    SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8: {
        name: PROGRAM_NAMES.SWAP,
        deployments: LIVE_CLUSTERS,
    },
    TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: {
        name: PROGRAM_NAMES.TOKEN,
        deployments: ALL_CLUSTERS,
    },
    metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: {
        name: PROGRAM_NAMES.TOKEN_METADATA,
        deployments: LIVE_CLUSTERS,
    },
    vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn: {
        name: PROGRAM_NAMES.TOKEN_VAULT,
        deployments: LIVE_CLUSTERS,
    },
    // other
    C64kTdg1Hzv5KoQmZrQRcm2Qz7PkxtFBgw7EpFhvYn8W: {
        name: PROGRAM_NAMES.ACUMEN,
        deployments: [Cluster.MainnetBeta],
    },
    WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6: {
        name: PROGRAM_NAMES.BONFIDA_POOL,
        deployments: [Cluster.MainnetBeta],
    },
    BrEAK7zGZ6dM71zUDACDqJnekihmwF15noTddWTsknjC: {
        name: PROGRAM_NAMES.BREAK_SOLANA,
        deployments: LIVE_CLUSTERS,
    },
    GqTPL6qRf5aUuqscLh8Rg2HTxPUXfhhAXDptTLhp1t2J: {
        name: PROGRAM_NAMES.MANGO_GOVERNANCE,
        deployments: [Cluster.MainnetBeta],
    },
    "7sPptkymzvayoSbLXzBsXEF8TSf3typNnAWkrKrDizNb": {
        name: PROGRAM_NAMES.MANGO_ICO,
        deployments: [Cluster.MainnetBeta],
    },
    JD3bq9hGdy38PuWQ4h2YJpELmHVGPPfFSuFkpzAd9zfu: {
        name: PROGRAM_NAMES.MANGO_1,
        deployments: [Cluster.MainnetBeta],
    },
    "5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEH": {
        name: PROGRAM_NAMES.MANGO_2,
        deployments: [Cluster.MainnetBeta],
    },
    mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68: {
        name: PROGRAM_NAMES.MANGO_3,
        deployments: [Cluster.MainnetBeta],
    },
    MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: {
        name: PROGRAM_NAMES.MARINADE,
        deployments: [Cluster.MainnetBeta],
    },
    MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky: {
        name: PROGRAM_NAMES.MERCURIAL,
        deployments: [Cluster.Devnet, Cluster.MainnetBeta],
    },
    p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98: {
        name: PROGRAM_NAMES.METAPLEX,
        deployments: LIVE_CLUSTERS,
    },
    auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8: {
        name: PROGRAM_NAMES.NFT_AUCTION,
        deployments: LIVE_CLUSTERS,
    },
    cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ: {
        name: PROGRAM_NAMES.NFT_CANDY_MACHINE,
        deployments: LIVE_CLUSTERS,
    },
    DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1: {
        name: PROGRAM_NAMES.ORCA_SWAP_1,
        deployments: [Cluster.MainnetBeta],
    },
    "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": {
        name: PROGRAM_NAMES.ORCA_SWAP_2,
        deployments: [Cluster.MainnetBeta],
    },
    "82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ": {
        name: PROGRAM_NAMES.ORCA_AQUAFARM,
        deployments: [Cluster.MainnetBeta],
    },
    Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR: {
        name: PROGRAM_NAMES.PORT,
        deployments: [Cluster.MainnetBeta],
    },
    gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s: {
        name: PROGRAM_NAMES.PYTH_DEVNET,
        deployments: [Cluster.Devnet],
    },
    "8tfDNiaEyrV6Q1U4DEXrEigs9DoDtkugzFbybENEbCDz": {
        name: PROGRAM_NAMES.PYTH_TESTNET,
        deployments: [Cluster.Testnet],
    },
    FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH: {
        name: PROGRAM_NAMES.PYTH_MAINNET,
        deployments: [Cluster.MainnetBeta],
    },
    QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto: {
        name: PROGRAM_NAMES.QUARRY_MERGE_MINE,
        deployments: LIVE_CLUSTERS,
    },
    QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB: {
        name: PROGRAM_NAMES.QUARRY_MINE,
        deployments: LIVE_CLUSTERS,
    },
    QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV: {
        name: PROGRAM_NAMES.QUARRY_MINT_WRAPPER,
        deployments: LIVE_CLUSTERS,
    },
    QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9: {
        name: PROGRAM_NAMES.QUARRY_REDEEMER,
        deployments: LIVE_CLUSTERS,
    },
    QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc: {
        name: PROGRAM_NAMES.QUARRY_REGISTRY,
        deployments: LIVE_CLUSTERS,
    },
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": {
        name: PROGRAM_NAMES.RAYDIUM_AMM,
        deployments: [Cluster.MainnetBeta],
    },
    "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC": {
        name: PROGRAM_NAMES.RAYDIUM_IDO,
        deployments: [Cluster.MainnetBeta],
    },
    RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr: {
        name: PROGRAM_NAMES.RAYDIUM_LP_1,
        deployments: [Cluster.MainnetBeta],
    },
    "27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv": {
        name: PROGRAM_NAMES.RAYDIUM_LP_2,
        deployments: [Cluster.MainnetBeta],
    },
    EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q: {
        name: PROGRAM_NAMES.RAYDIUM_STAKING,
        deployments: [Cluster.MainnetBeta],
    },
    Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t: {
        name: PROGRAM_NAMES.SABER_ROUTER,
        deployments: [Cluster.Devnet, Cluster.MainnetBeta],
    },
    SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ: {
        name: PROGRAM_NAMES.SABER_SWAP,
        deployments: [Cluster.Devnet, Cluster.MainnetBeta],
    },
    BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg: {
        name: PROGRAM_NAMES.SERUM_1,
        deployments: [Cluster.MainnetBeta],
    },
    EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o: {
        name: PROGRAM_NAMES.SERUM_2,
        deployments: [Cluster.MainnetBeta],
    },
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin": {
        name: PROGRAM_NAMES.SERUM_3,
        deployments: [Cluster.MainnetBeta],
    },
    "22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD": {
        name: PROGRAM_NAMES.SERUM_SWAP,
        deployments: [Cluster.MainnetBeta],
    },
    So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo: {
        name: PROGRAM_NAMES.SOLEND,
        deployments: [Cluster.MainnetBeta],
    },
    CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi: {
        name: PROGRAM_NAMES.SOLIDO,
        deployments: [Cluster.MainnetBeta],
    },
    SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1: {
        name: PROGRAM_NAMES.STEP_SWAP,
        deployments: [Cluster.MainnetBeta],
    },
    SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC: {
        name: PROGRAM_NAMES.SWIM_SWAP,
        deployments: [Cluster.MainnetBeta],
    },
    DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM: {
        name: PROGRAM_NAMES.SWITCHBOARD,
        deployments: [Cluster.MainnetBeta],
    },
    WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC: {
        name: PROGRAM_NAMES.WORMHOLE,
        deployments: [Cluster.MainnetBeta],
    },
};
export const LOADER_IDS = {
    MoveLdr111111111111111111111111111111111111: "Move Loader",
    NativeLoader1111111111111111111111111111111: "Native Loader",
    [BPF_LOADER_DEPRECATED_PROGRAM_ID.toBase58()]: "BPF Loader",
    [BPF_LOADER_PROGRAM_ID.toBase58()]: "BPF Loader 2",
    BPFLoaderUpgradeab1e11111111111111111111111: "BPF Upgradeable Loader",
};
export const SPECIAL_IDS = {
    "1nc1nerator11111111111111111111111111111111": "Incinerator",
    Sysvar1111111111111111111111111111111111111: "SYSVAR",
};
export const SYSVAR_IDS = {
    [SYSVAR_CLOCK_PUBKEY.toBase58()]: "Sysvar: Clock",
    SysvarEpochSchedu1e111111111111111111111111: "Sysvar: Epoch Schedule",
    SysvarFees111111111111111111111111111111111: "Sysvar: Fees",
    SysvarRecentB1ockHashes11111111111111111111: "Sysvar: Recent Blockhashes",
    [SYSVAR_RENT_PUBKEY.toBase58()]: "Sysvar: Rent",
    [SYSVAR_REWARDS_PUBKEY.toBase58()]: "Sysvar: Rewards",
    SysvarS1otHashes111111111111111111111111111: "Sysvar: Slot Hashes",
    SysvarS1otHistory11111111111111111111111111: "Sysvar: Slot History",
    [SYSVAR_STAKE_HISTORY_PUBKEY.toBase58()]: "Sysvar: Stake History",
    Sysvar1nstructions1111111111111111111111111: "Sysvar: Instructions",
};
export const SOLANA_EXPLORER_PROGRAMS = {
    ...mapValues(PROGRAM_INFO_BY_ID, (info) => info.name),
    ...LOADER_IDS,
    ...SPECIAL_IDS,
    ...SYSVAR_IDS,
};
