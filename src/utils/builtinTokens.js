import { SBR_MINT } from '@saberhq/saber-periphery';
export const SBR_INFO = {
    name: 'Saber Protocol Token',
    symbol: 'SBR',
    address: SBR_MINT,
    logoURI: 'https://registry.saber.so/token-icons/sbr.svg',
    decimals: 6,
    chainId: 101,
};
/**
 * Tags on tokens.
 */
export var Tags;
(function (Tags) {
    Tags["DecimalWrapped"] = "saber-dec-wrapped";
    Tags["Hidden"] = "saber-hidden";
    Tags["StableSwapLP"] = "saber-stableswap-lp";
    Tags["Swappable"] = "saber-swappable";
})(Tags || (Tags = {}));
