import { CURRENT_APP } from "../../../config";
import { MainLayoutInner } from "../../layout/MainLayout/MainLayoutInner";
import { GokiIndexView } from "./GokiIndexView";
import { TribecaIndexView } from "./TribecaIndexView";

export const IndexView: React.FC = () => {
  return (
    <>
      {CURRENT_APP === "anchor" ? (
        <div />
      ) : CURRENT_APP === "tribeca" ? (
        <TribecaIndexView />
      ) : (
        <MainLayoutInner>
          <GokiIndexView />
        </MainLayoutInner>
      )}
    </>
  );
};

export default IndexView;
