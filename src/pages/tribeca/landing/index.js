import { CURRENT_APP } from "../../../config";
import { MainLayoutInner } from "../../layout/MainLayout/MainLayoutInner";
import { TribecaIndexView } from "./TribecaIndexView";
export const IndexView = () => {
    return (React.createElement(React.Fragment, null, CURRENT_APP === "anchor" ? (React.createElement("div", null)) : CURRENT_APP === "tribeca" ? (React.createElement(TribecaIndexView, null)) : (React.createElement(MainLayoutInner, null,
        React.createElement(GokiIndexView, null)))));
};
export default IndexView;
