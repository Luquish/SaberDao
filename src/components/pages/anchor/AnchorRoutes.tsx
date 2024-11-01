import React from "react";
import { Route } from "react-router-dom";

const AddressPage = React.lazy(() => import("./AddressPage"));
const BuildPage = React.lazy(() => import("./builds/BuildPage"));
const ErrorsPage = React.lazy(() => import("./ErrorsPage"));
const InspectorPage = React.lazy(() => import("./InspectorPage"));
const ProgramPage = React.lazy(() => import("./programs/ProgramPage"));
const ProgramsPage = React.lazy(() => import("./programs/ProgramsPage"));
const RegistryPage = React.lazy(() => import("./RegistryPage"));
const TransactionInspectPage = React.lazy(() => import("./tx/InspectPage"));

const CashioIndexPage = React.lazy(() => import("./cashio/CashioIndexPage"));
const CashioSubmissionsPage = React.lazy(
  () => import("./cashio/CashioSubmissionsPage")
);
const CashioVerifyPage = React.lazy(() => import("./address/CashioVerifyPage"));

export const ANCHOR_ROUTES = [
  <Route
    key="cashio"
    path="/cashio/submissions"
    element={<CashioSubmissionsPage />}
  />,
  <Route key="cashio" path="/cashio" element={<CashioIndexPage />} />,
  <Route
    key="build"
    path="/builds/:org/:programName/:version"
    element={<BuildPage />}
  />,
  <Route key="errors" path="/errors" element={<ErrorsPage />} />,
  <Route
    key="address-cashio"
    path="/address/:address/cashio"
    element={<CashioVerifyPage />}
  />,
  <Route key="address" path="/address/:address" element={<AddressPage />} />,
  <Route key="registry" path="/registry" element={<RegistryPage />} />,
  <Route
    key="inspect"
    path="/tx/:txid/inspect"
    element={<TransactionInspectPage />}
  />,
  <Route key="inspector" path="/tx/inspector" element={<InspectorPage />} />,
  <Route key="programs" path="/programs" element={<ProgramsPage />} />,
  <Route key="program" path="/programs/:programID" element={<ProgramPage />} />,
];
