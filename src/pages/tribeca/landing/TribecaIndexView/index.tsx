import { RouteComponentProps } from '@reach/router';
import { useEffect } from "react";
import React from "react";

import Header from "@/components/tribeca/layout/GovernorLayout/Header";
import Alliance from "@/pages/tribeca/alliance";
import Jumbotron from "./Jumbotron";

const TribecaIndexView: React.FC<RouteComponentProps> = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative w-screen min-h-screen">
        <div 
          className="absolute"
          style={{
            left: '30%',
            bottom: '30%',
            transform: 'translate(-50%, 0px)',
            width: '1560px',
            height: '1560px',
            background: 'radial-gradient(50% 50% at 50% 50%, rgb(150, 50, 249) 0%, rgba(0, 0, 0, 0) 100%)'
          }}
        ></div>
        <div className="w-11/12 mx-auto">
          <Header placeholder={true} />
        </div>
        <Jumbotron />
      </div>
      <div className="overflow-x-hidden">
        <div className="w-11/12">
          <Alliance />
        </div>
      </div>
    </div>
  );
};

export default TribecaIndexView;
