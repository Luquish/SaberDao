import { Global } from "@emotion/react";
import tw from "twin.macro";
import styled, { css } from "styled-components";

import { Header } from "./Header";

interface Props {
  placeholder?: boolean;
  children?: React.ReactNode;
}

export const GovernorLayout: React.FC<Props> = ({
  children,
  placeholder = false,
}: Props) => {
  return (
    <div>
      <Header placeholder={placeholder} />
      <Global
        styles={{
          body: {
            '&.dark': {
              backgroundColor: '#1F2937'
            }
          }
        }}
      />
      <div tw="flex w-screen">
        <div tw="flex-grow h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};
