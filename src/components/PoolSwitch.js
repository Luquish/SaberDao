// src/components/PoolSwitch.tsx
import clsx from 'clsx';
import React from 'react';
import { BsGridFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa';
import { useLocalStorage } from 'usehooks-ts';
export var PoolsView;
(function (PoolsView) {
    PoolsView["GRID"] = "GRID";
    PoolsView["LIST"] = "LIST";
})(PoolsView || (PoolsView = {}));
export default function PoolSwitch() {
    const [poolsView, setPoolsView] = useLocalStorage('poolsView', PoolsView.LIST);
    const toggle = () => {
        const newSelected = poolsView === PoolsView.LIST ? PoolsView.GRID : PoolsView.LIST;
        setPoolsView(newSelected);
    };
    return (React.createElement("div", { className: "flex items-center text-lg rounded-lg overflow-hidden cursor-pointer text-slate-200", onClick: () => toggle() },
        React.createElement("div", { className: clsx('py-2 px-2', poolsView === PoolsView.LIST ? 'bg-gradient-to-r from-saber-dark to-saber-light' : 'bg-slate-800') },
            React.createElement(FaList, null)),
        React.createElement("div", { className: clsx('py-2 px-2', poolsView === PoolsView.GRID ? 'bg-gradient-to-r from-saber-dark to-saber-light' : 'bg-slate-800') },
            React.createElement(BsGridFill, null))));
}
