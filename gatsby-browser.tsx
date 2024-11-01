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