import { BasicPage } from "../../../../../common/page/BasicPage";
import { BulkCreateStream } from "./BulkCreateStream";
export const VenkoBulkCreateStreamView = () => {
    return (React.createElement(BasicPage, { title: "Issue Bulk Venko Streams", description: "Issue Venko Streams in Bulk" },
        React.createElement(BulkCreateStream, null)));
};
