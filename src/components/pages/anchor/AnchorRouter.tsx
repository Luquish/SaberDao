import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ANCHOR_ROUTES } from "./AnchorRoutes";
import { AnchorIndexView } from "./IndexPage";

export const AnchorRouter: React.FC = () => {
  return (
    <Suspense>
      <BrowserRouter basename="/">
        <Routes>
          {ANCHOR_ROUTES}
          <Route path="/" element={<AnchorIndexView />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AnchorRouter;
