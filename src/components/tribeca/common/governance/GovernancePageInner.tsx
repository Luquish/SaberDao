import { BsArrowLeft } from "react-icons/bs";
import { Link } from "gatsby";
import React from "react";

import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { ImageWithFallback } from "../ImageWithFallback";
import { Footer } from "./Footer";

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
}

export const GovernancePageInner: React.FC<Props> = ({
  title,
  header,
  right,
  preContent,
  children,
  contentStyles,
  containerStyles,
  hideDAOName = false,
  backLink,
}: Props) => {
  const { daoName, iconURL } = useGovernor();
  return (
    <div className="w-full">
      <div className="bg-warmGray-900 pb-24">
        <div className="h-6 mx-auto w-11/12 max-w-7xl mb-4">
          {!hideDAOName && (
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ImageWithFallback
                src={iconURL}
                size={24}
                alt={`Icon for ${daoName ?? "DAO"}`}
              />
              <span>{daoName} Governance</span>
            </div>
          )}
        </div>
        <PageContainer className="w-11/12" style={containerStyles}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:min-h-[120px] flex-wrap items-center justify-between w-full">
            <div className="flex flex-col self-start md:self-center">
              {backLink && (
                <Link
                  to={backLink.href}
                  className="flex items-center gap-2 uppercase font-bold mb-7 hover:text-white"
                >
                  <BsArrowLeft className="w-5 h-5" />
                  <span className="leading-none text-sm tracking-tighter">
                    {backLink.label}
                  </span>
                </Link>
              )}
              {typeof title === "string" ? (
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                  {title}
                </h1>
              ) : (
                title
              )}
              {header}
            </div>
            {right && <div>{right}</div>}
          </div>
          {preContent && <div className="mt-8">{preContent}</div>}
        </PageContainer>
      </div>
      <PageContainer style={containerStyles}>
        <main className="w-full -mt-16 mb-20" style={contentStyles}>
          {children}
        </main>
      </PageContainer>
      <Footer />
    </div>
  );
};

export const PageContainer: React.FC<{ className?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ 
    children, 
    style,
    className = "" 
  }) => (
    <div className={`max-w-5xl w-full md:w-11/12 mx-auto ${className}`} style={style}>
      {children}
    </div>
  );
