import { useRewarder } from "@rockooor/react-quarry";
import { TableCardBody } from "@/common/card/TableCardBody";
import { GaugeInfo } from "./GaugeInfo";
export const GaugeSelector = () => {
    const { quarries } = useRewarder();
    return (React.createElement(TableCardBody, { head: React.createElement("tr", null,
            React.createElement("th", null, "Token"),
            React.createElement("th", null, "Mint"),
            React.createElement("th", null, "Enabled?"),
            React.createElement("th", null, "Actions")) }, quarries?.map((quarry) => (React.createElement(GaugeInfo, { key: quarry.key.toString(), quarry: quarry })))));
};
