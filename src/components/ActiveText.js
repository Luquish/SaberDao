// src/components/ActiveText.tsx
import React from 'react';
export default function ActiveText(props) {
    return (React.createElement("div", { className: "flex" },
        React.createElement("div", { className: "group relative" },
            React.createElement("div", { className: "text-slate-200 bg-slate-800  z-1 relative px-3 cursor-pointer rounded-lg flex gap-1 justify-center items-center transition-colors" }, props.children))));
}
