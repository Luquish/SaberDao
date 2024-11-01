import { css, Global } from "@emotion/react";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

export const globalStyles = (
  <>
    <BaseStyles />
    <Global
      styles={css`
        * {
          ${tw`antialiased`}
        }
        [data-reach-dialog-overlay] {
          z-index: 999 !important;
        }
        [data-reach-dialog-content] {
          width: 100vw !important;
        }
        html,
        body {
          ${tw`h-full w-full`}
        }
        body {
          ${tw`font-sans bg-white text-gray-800 dark:(bg-warmGray-800 text-gray-300)`};
          // twin macro doesn't seem to pick this up if we use the "dark:" tailwind attribute
          &.dark {
            ${tw`bg-warmGray-900 text-gray-300`};
          }
        }
      `}
    />
  </>
);
