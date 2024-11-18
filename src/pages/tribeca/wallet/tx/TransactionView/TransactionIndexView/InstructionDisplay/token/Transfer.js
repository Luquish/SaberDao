import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { AddressLink } from "@/common/AddressLink";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { TokenAmountDisplay } from "@/common/TokenAmountDisplay";
import { Box } from "../Box";
export const Transfer = ({ data: { mint, tokenAmount: { amount }, destination, }, }) => {
    const { data: token } = useToken(mint);
    const amt = token ? new TokenAmount(token, amount) : token;
    return (React.createElement(Box, { title: "Summary" }, amt ? (React.createElement("div", { tw: "inline-flex items-center gap-2" },
        "Transfer ",
        React.createElement(TokenAmountDisplay, { amount: amt, showIcon: true }),
        " to",
        " ",
        React.createElement(AddressLink, { address: destination }))) : (React.createElement(LoadingSpinner, null))));
};
