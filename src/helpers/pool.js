// src/helpers/pool.ts
export const getPoolName = (name) => {
    return name.replace('scnSOL', 'INF');
};
export const getSymbol = (symbol) => {
    if (symbol === 'scnSOL') {
        return 'INF';
    }
    return symbol;
};
export const getLogo = (symbol, logo) => {
    if (symbol === 'scnSOL') {
        return 'https://bafkreiflz2xxkfn33qjch2wj55bvbn33q3s4mmb6bye5pt3mpgy4t2wg4e.ipfs.nftstorage.link/';
    }
    return logo;
};
export const getPoolId = (id) => {
    if (id === 'socean') {
        return 'sanctum';
    }
    return id;
};
