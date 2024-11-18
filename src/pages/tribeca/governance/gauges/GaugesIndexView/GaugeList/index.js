import { RewarderProvider } from "@rockooor/react-quarry";
import { useEnvironment } from "@/utils/useEnvironment";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { useGM } from "../../context";
import { GaugeListInner } from "./GaugeListInner";
export const GaugeList = ({ limit }) => {
    const { rewarderKey } = useGM();
    const { network } = useEnvironment();
    return (React.createElement(React.Fragment, null, rewarderKey ? (React.createElement(RewarderProvider, { initialState: { rewarderKey, network } },
        React.createElement(GaugeListInner, { limit: limit }))) : (React.createElement(LoadingPage, { tw: "h-96" }))));
};
