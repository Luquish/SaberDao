import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

interface Props {
  options: readonly {
    label: string;
    path: string;
  }[];
}

export const NavTabs: React.FC<Props> = ({ options }: Props) => (
  <div className="p-1 mx-auto flex gap-0.5 grid-flow-col bg-gray-100 rounded-2xl text-sm">
    {options.map(({ label, path }) => {
      return (
        <Link
          to={path}
          key={path}
          activeClassName="selected"
          className={clsx(
            "font-sans font-semibold px-4 py-2 rounded-2xl w-[120px] grid justify-items-center text-gray-700",
            "hover:bg-gray-800 hover:bg-opacity-20"
          )}
        >
          <span>{label}</span>
        </Link>
      );
    })}
  </div>
);
