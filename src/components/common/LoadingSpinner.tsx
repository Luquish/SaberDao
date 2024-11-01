import { CgSpinner } from "react-icons/cg";
import tw, { styled } from "twin.macro";

export const LoadingSpinner = styled(CgSpinner)`
  ${tw`animate-spin`}

  display: inline;
  height: 1em;
  width: 1em;
`;
