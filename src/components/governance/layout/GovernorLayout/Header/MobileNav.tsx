import { useState } from "react";
import { FaGripLines } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import tw from "twin.macro";


import { useNavLinks } from "./Nav";

interface Props {
  className?: string;
}

export const MobileNav: React.FC<Props> = ({ className }: Props) => {
  const { governor } = useParams<{ governor: string }>();
  const [showNav, setShowNav] = useState<boolean>(false);
  const navLinks = useNavLinks();
  return (
    <div className={className}>
      <div
        tw={[
          'fixed left-0 bottom-0 h-screen w-screen bg-gray-900 transition-all transition-duration[500ms] z-10',
          'h-[calc(100vh-80px)]',
          !showNav && 'opacity-0 pointer-events-none',
          !showNav && '-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.77,0.2,0.05,1)] transition-opacity duration-300 ease-in',
          showNav && 'translate-y-0 opacity-100',
          'flex flex-col',
        ].join(' ')}
      >
        <div tw="flex flex-grow items-center justify-center">
          <div tw="flex flex-col items-center font-bold text-base text-white">
            {navLinks.map(({ title, href }) => (
              <NavLink
                key={href}
                to={`/gov/${governor ?? ""}${href}`}
                tw="py-5"
                onClick={() => {
                  setShowNav(false);
                }}
              >
                <div>{title}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <button
        tw="z-20 relative"
        onClick={() => {
          setShowNav((res) => !res);
        }}
      >
        <FaGripLines />
      </button>
    </div>
  );
};
