// src/hooks/useFeaturedPools.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNullableWithSessionCache } from '../helpers/fetch';
export default function useFeaturedPools() {
    return useQuery({
        queryKey: ['featuredPools'],
        staleTime: 1000 * 60,
        queryFn: async () => {
            const swaps = await fetchNullableWithSessionCache(`https://raw.githubusercontent.com/saberdao/info/main/featuredPools.json`);
            if (!swaps) {
                throw Error('Could not find file');
            }
            return swaps;
        },
    });
}
