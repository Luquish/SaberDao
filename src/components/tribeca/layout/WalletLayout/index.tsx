import React from 'react';
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactNode;
}

export default function WalletLayout({ children }: Props) {
  return (
    <div className="flex w-screen">
      <Sidebar />
      <div className="flex-grow h-screen overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};
