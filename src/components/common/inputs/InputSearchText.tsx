import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const InputSearchText: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
}: Props) => {
  return (
    <div
      tw="flex py-1.5 px-3 border border-gray-200 rounded m-0 transition-colors appearance-none
          dark:(bg-gray-850 border-gray-700)
          focus-within:(ring-primary-300 ring-1 bg-transparent)"
    >
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        tw="bg-transparent outline-none text-sm"
      ></input>
      <FaSearch tw="w-3.5 h-3.5 my-auto text-secondary" />
    </div>
  );
};
