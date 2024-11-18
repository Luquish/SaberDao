import { fetchNullableWithSessionCache } from "@saberhq/sail";
const cache = {};
export const getRewarder = async (network, rewarder) => {
    if (cache[`${network}|${rewarder}`]) {
        return cache[`${network}|${rewarder}`];
    }
    const rewarders = await fetchNullableWithSessionCache(`https://raw.githubusercontent.com/QuarryProtocol/rewarder-list-build/master/${network}/rewarders/${rewarder}/full.json`);
    if (!rewarders) {
        throw Error('Could not find rewarders');
    }
    cache[`${network}|${rewarder}`] = rewarders;
    return cache[`${network}|${rewarder}`];
};
