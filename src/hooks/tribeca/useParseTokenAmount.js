import { TokenAmount } from "@saberhq/token-utils";
import { useMemo } from "react";
export const useParseTokenAmount = (token, valueStr) => {
    return useMemo(() => {
        if (!valueStr) {
            return null;
        }
        if (!token) {
            return token;
        }
        try {
            return TokenAmount.parse(token, valueStr);
        }
        catch (e) {
            return null;
        }
    }, [token, valueStr]);
};
