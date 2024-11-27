import { CgSpinner } from "react-icons/cg";
import tw from "twin.macro";
import styled from "styled-components";

export const LoadingSpinner = styled(CgSpinner)`
  ${tw`animate-spin`}

  display: inline;
  height: 1em;
  width: 1em;
`;
