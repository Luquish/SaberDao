import { BasicPage } from "../../../../../common/page/BasicPage";
import { VenkoLockup } from "./VenkoLockup";
export const VenkoIndexView = () => {
    return (React.createElement(BasicPage, { title: "Venko", description: "Redeem a Stream" },
        React.createElement(VenkoLockup, null)));
};
