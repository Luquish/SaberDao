import React from 'react';

export const wrapPageElement = ({
    element,
    props,
}: {
    element: React.ReactElement;
    props: Record<string, unknown> & { location: Location };
}) => {
    return element;
};

const HeadComponents = [
    <script 
        key="ga-script"
        async 
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_ID}`}
    />,
    <script key="ga-config" dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${process.env.REACT_APP_GA_ID}");
        `
    }}/>,
    <meta key="meta-1" name="description" content="Unified Dapp"/>,
    <meta key="meta-2" property="og:title" content="Unified Dapp"/>,
    <meta key="meta-3" property="og:type" content="website"/>,
    <link key="head-1" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link key="head-2" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />,
    <link key="head-3" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;600&family=Josefin+Sans:wght@200;600&family=Montserrat:wght@500&display=swap" rel="stylesheet" />,
    <style key="head-4">{`
        html {
            background-color: #1f2937;
            background-attachment: fixed;
            background-image: linear-gradient(to bottom, #030712, #1f2937);
        }
        #root {
            height: 100%;
        }
    `}</style>,
];

export const onRenderBody = ({
    setHeadComponents,
}: {
    setHeadComponents: (components: React.ReactNode[]) => void;
}) => {
    setHeadComponents(HeadComponents);
}; 