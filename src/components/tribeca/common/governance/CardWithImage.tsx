import Card from "./Card";
import React from "react";

interface Props {
  title?: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
}

export default function CardWithImage({
  title,
  children,
  image,
}: Props) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6">
          <h4 className="text-base font-bold mb-3.5 text-white">{title}</h4>
          {children}
        </div>
        <div className="flex-1 md:w-1/2 bg-warmGray-900">{image}</div>
      </div>
    </Card>
  );
}