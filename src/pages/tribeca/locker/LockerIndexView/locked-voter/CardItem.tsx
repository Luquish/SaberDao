import React from "react";
        
interface Props {
  label: string;
  children?: React.ReactNode;
}

const CardItem: React.FC<Props> = ({ label, children }: Props) => {
  return (
    <div className="px-7 py-4 border-b border-warmGray-800">
      <span className="text-warmGray-400 text-sm">{label}</span>
      <div className="text-xl text-white mt-0.5">{children}</div>
    </div>
  );
};

export default CardItem;
