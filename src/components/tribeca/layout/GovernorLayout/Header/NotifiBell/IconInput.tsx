import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

export const IconInput: React.FC<Props> = ({ icon, ...inputProps }: Props) => {
  return (
    <div className="relative text-gray-600 focus-within:text-gray-400">
      <span className="py-2 line-height[1.5rem] text-sm absolute height[100%] left-0 flex items-center pl-3">
        {icon}
      </span>
      <input
        className="py-2 text-sm text-white rounded-md width[100%] focus:(outline-none bg-white text-gray-900)"
        {...inputProps}
      ></input>
    </div>
  );
};
