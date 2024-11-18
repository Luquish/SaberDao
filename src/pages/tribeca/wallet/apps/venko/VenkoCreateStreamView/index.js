import { BasicPage } from "../../../../../common/page/BasicPage";
import { CreateStream } from "./CreateStream";
export const VenkoCreateStreamView = () => {
    return (React.createElement(BasicPage, { title: "Issue a Venko Stream", description: "Issue a Venko Stream" },
        React.createElement(CreateStream, null)));
};
