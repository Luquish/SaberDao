import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import React from 'react';

interface Props {
  numPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PageNav: React.FC<Props> = (props: Props) => {
  const { currentPage, setCurrentPage, numPages } = props;
  return (
    <>
      <div className="flex items-center justify-between px-7 py-3">
        <div className="w-20">
          {currentPage !== 0 ? (
            <button 
              className="flex gap-2 relative justify-center items-center hover:text-primary-300 uppercase"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <FaChevronLeft />
              Prev
            </button>
          ) : (
            <div />
          )}
        </div>
        <nav aria-label="Page navigation" className="flex-grow">
          <ul className="w-full justify-center flex gap-4 items-center">
            {new Array(numPages).fill(null).map((_, i) => (
              <li key={i}>
                <button
                  className={`transition-colors ${
                    currentPage === i ? "text-primary-300" : ""
                  }`}
                  onClick={() => setCurrentPage(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="w-20 text-right">
          {currentPage !== numPages - 1 ? (
            <button
              className="flex gap-2 relative justify-center items-center hover:text-primary-300 uppercase"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <FaChevronRight />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
};

export default PageNav;
