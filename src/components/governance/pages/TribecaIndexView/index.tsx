import React,{ useEffect } from "react";
import tw from "twin.macro";
import { RouteComponentProps } from "@reach/router";

import { Header } from "@/components/governance/layout/GovernorLayout/Header";
import { Alliance } from "./Alliance";
import { Jumbotron } from "./Jumbotron";

interface Props extends RouteComponentProps {}

export const TribecaIndexView: React.FC<Props> = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div tw="relative">
      <div tw="relative w-screen min-h-screen">
        <div tw="absolute left-[30%] bottom-[30%] -translate-x-1/2 w-[1560px] h-[1560px] bg-gradient-to-bl from-purple-500/50 to-transparent"></div>
        <div tw="w-11/12 mx-auto">
          <Header placeholder={false} />
        </div>
        <Jumbotron />
      </div>
      <div tw="overflow-x-hidden">
        <div tw="w-11/12">
          <Alliance />
        </div>
      </div>
    </div>
  );
};
