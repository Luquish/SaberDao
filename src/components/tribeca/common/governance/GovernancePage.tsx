import React from "react";

import {
  useGovernor,
  useGovernorInfo,
} from "@/hooks/tribeca/useGovernor";
import GovernanceNotFoundPage from "@/pages/tribeca/GovernanceNotFoundPage";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import GovernancePageInner from "./GovernancePageInner";

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  hideDAOName?: boolean;
  backLink?: {
    label: string;
    href: string;
  };
  containerClassName?: string;
}

export default function GovernancePage({ ...props }: Props) {
  const info = useGovernorInfo();
  const { governorData } = useGovernor();
  if (!info || governorData === null) {
    return <GovernanceNotFoundPage />;
  }
  if (info?.loading) {
    return <LoadingPage />;
  }
  return <GovernancePageInner {...props} />;
}