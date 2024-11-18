import React from 'react';
import clsx from 'clsx';
export function Prose({ children, className, small = false }) {
    return (React.createElement("div", { className: clsx(
        // Base styles
        'prose', small ? 'text-sm' : 'text-sm sm:text-base', 'leading-relaxed', 
        // Custom class for nested elements
        'prose-p:mb-4 prose-p:last:mb-0', 'prose-a:text-primary hover:prose-a:underline', 'prose-code:hyphens-auto', 'prose-ol:list-decimal prose-ol:pl-4', 'prose-ul:list-disc prose-ul:pl-4', 'prose-headings:text-white prose-headings:font-semibold', 'prose-h1:text-xl', 'prose-h2:text-lg', 'prose-h3:text-base prose-h3:sm:text-lg', className) }, children));
}
export function ProseSmall({ children, className }) {
    return (React.createElement(Prose, { small: true, className: className }, children));
}
