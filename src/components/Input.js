// src/components/Input.tsx
import clsx from 'clsx';
import React from 'react';
export var InputType;
(function (InputType) {
    InputType["TEXT"] = "TEXT";
    InputType["NUMBER"] = "NUMBER";
    InputType["DROPDOWN"] = "DROPDOWN";
    InputType["CHECKBOX"] = "CHECKBOX";
    InputType["SWITCH"] = "SWITCH";
})(InputType || (InputType = {}));
export default function Input(props) {
    if (!props.type || props.type === InputType.TEXT) {
        return (React.createElement("div", { className: clsx('flex', props.size === 'full' && 'w-full') },
            React.createElement("div", { className: clsx('group relative', props.size === 'full' && 'w-full') },
                React.createElement("input", { ...props.register, type: "text", placeholder: props.placeholder, defaultValue: props.defaultValue, className: clsx('bg-slate-800 z-1 relative text-slate-200 rounded-lg focus:outline-none transition-colors text-sm py-2 px-3 placeholder:italic placeholder:text-slate-400', props.size === 'full' && 'w-full') }))));
    }
    if (props.type === InputType.NUMBER) {
        return (React.createElement("div", { className: clsx('flex', props.size === 'full' && 'w-full') },
            React.createElement("div", { className: clsx('group relative', props.size === 'full' && 'w-full') },
                React.createElement("div", { className: clsx(props.align === 'right' ? 'bg-gradient-to-r' : 'bg-gradient-to-l') }),
                React.createElement("input", { ...props.register, type: "number", placeholder: props.placeholder, className: clsx('relative z-1 bg-transparent text-xl text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none', props.size === 'full' && 'w-full', props.align === 'right' && 'text-right') }))));
    }
    if (props.type === InputType.CHECKBOX) {
        return (React.createElement("div", { className: clsx('flex', props.size === 'full' && 'w-full') },
            React.createElement("div", { className: clsx('group relative', props.size === 'full' && 'w-full') },
                React.createElement("div", { className: "bg-slate-800 z-1 relative text-slate-200 rounded-lg focus:outline-none transition-colors text-sm py-2 px-3" },
                    React.createElement("label", { className: clsx('flex items-center gap-1', props.size === 'full' && 'w-full') },
                        React.createElement("input", { ...props.register, type: "checkbox", className: "py-2 relative z-1 bg-transparent text-xl text-right text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none" }),
                        props.label)))));
    }
    if (props.type === InputType.DROPDOWN) {
        return (React.createElement("div", { className: clsx('flex', props.size === 'full' && 'w-full') },
            React.createElement("div", { className: "group relative" },
                React.createElement("select", { ...props.register, className: clsx('bg-slate-800 relative z-1 cursor-pointer text-slate-200 rounded-lg focus:outline-none transition-colors text-sm py-2 px-3') },
                    props.placeholder && React.createElement("option", { key: "placeholder", value: "", disabled: true, selected: true }, props.placeholder),
                    props.values.map(value => (React.createElement("option", { key: value[0], value: value[0] }, value[1])))))));
    }
}
