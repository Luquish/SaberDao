import { AnchorLayout } from "../../../layout/AnchorLayout";
import { Jumbotron } from "./Jumbotron";

export const AnchorIndexView: React.FC = () => {
  return (
    <AnchorLayout>
      <div tw="w-11/12 mx-auto overflow-x-hidden">
        <div tw="min-h-screen">
          <Jumbotron />
        </div>
      </div>
    </AnchorLayout>
  );
};
