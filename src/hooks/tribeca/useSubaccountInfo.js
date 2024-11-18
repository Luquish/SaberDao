import { findSubaccountInfoAddress } from "@gokiprotocol/client";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { useSubaccountInfoData } from "../../utils/tribeca/parsers";
export const useSubaccountInfo = (key) => {
    const { data: subaccountInfoKey } = useQuery({
        queryKey: ["subaccountInfoKey", key?.toString()],
        queryFn: async () => {
            invariant(key);
            const [sub] = await findSubaccountInfoAddress(key);
            return sub;
        },
        enabled: !!key,
    });
    return useSubaccountInfoData(subaccountInfoKey);
};
