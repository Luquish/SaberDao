import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import tw from "twin.macro";
import styled, { css } from "styled-components";

interface Props {
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PageButton = styled.button<{ isActive: boolean }>`
  ${({ isActive }) => isActive ? tw`text-gray-300` : ''};
  ${tw`transition-colors`}
`;

export const PageNav: React.FC<Props> = (props: Props) => {
  const { currentPage, setCurrentPage, numPages } = props;
  return (
    <div tw="flex items-center justify-between px-7 py-3">
      <div tw="w-20">
        {currentPage !== 0 ? (
          <SideButton onClick={() => setCurrentPage(currentPage - 1)}>
            <FaChevronLeft />
            Prev
          </SideButton>
        ) : (
          <div />
        )}
      </div>
      <nav aria-label="Page navigation" tw="flex-grow">
        <ul tw="w-full justify-center flex gap-4 items-center">
          {new Array(numPages).fill(null).map((_, i) => (
            <li key={i}>
              <PageButton
                isActive={currentPage === i}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </PageButton>
            </li>
          ))}
        </ul>
      </nav>
      <div tw="w-20 text-right">
        {currentPage !== numPages - 1 ? (
          <SideButton onClick={() => setCurrentPage(currentPage + 1)}>
            Next
            <FaChevronRight />
          </SideButton>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

const SideButton = styled.button`
  ${tw`flex gap-2 relative justify-center items-center hover:text-gray-300 uppercase`}
`;
