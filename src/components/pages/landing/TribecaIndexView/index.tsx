import { useEffect } from "react";
import tw, { css } from "twin.macro";

import { Header } from "../../../layout/MainLayout/Header";
import { Alliance } from "./Alliance";
import { Jumbotron } from "./Jumbotron";

export const TribecaIndexView: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div tw="relative">
      <div tw="relative w-screen min-h-screen">
        <div
          css={css`
            ${tw`absolute`}
            left: 30%;
            bottom: 30%;
            transform: translate(-50%, 0px);
            width: 1560px;
            height: 1560px;
            background: radial-gradient(
              50% 50% at 50% 50%,
              rgb(150, 50, 249) 0%,
              rgba(0, 0, 0, 0) 100%
            );
          `}
        ></div>
        <div tw="w-11/12 mx-auto">
          <Header />
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
