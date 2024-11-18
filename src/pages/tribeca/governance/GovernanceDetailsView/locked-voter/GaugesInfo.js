import { formatDurationSeconds } from "../../../../../utils/format";
import { useGaugemeisterData } from "../../../../../utils/parsers";
import { AttributeList } from "../../../../common/AttributeList";
import { Card } from "../../../../common/governance/Card";
export const GaugesInfo = ({ gaugemeister }) => {
    const { data: gmData } = useGaugemeisterData(gaugemeister);
    return (React.createElement(Card, { title: "Gauges", tw: "pb-2" },
        React.createElement(AttributeList, { transformLabel: false, attributes: {
                Gaugemeister: gmData?.publicKey,
                Foreman: gmData?.account.foreman,
                Operator: gmData?.account.operator,
                Rewarder: gmData?.account.rewarder,
                "Epoch Duration": gmData
                    ? formatDurationSeconds(gmData.account.epochDurationSeconds)
                    : gmData,
            } })));
};
