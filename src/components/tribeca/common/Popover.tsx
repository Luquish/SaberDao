import React from 'react';
import clsx from 'clsx';

interface ArrowProps {
  className?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

function Arrow({ className, position }: ArrowProps) {
  return (
    <div 
      className={clsx(
        'w-2 h-2 z-[9998] before:absolute before:w-2 before:h-2 before:z-[9998]',
        'before:content-[""] before:rotate-45',
        {
          'bottom-[-5px] before:border-t-0 before:border-l-0': position === 'top',
          'top-[-5px] before:border-b-0 before:border-r-0': position === 'bottom',
          'right-[-5px] before:border-b-0 before:border-l-0': position === 'left',
          'left-[-5px] before:border-r-0 before:border-t-0': position === 'right',
        },
        className
      )}
    />
  );
}

interface PopoverProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showArrow?: boolean;
}

export function Popover({ 
  children, 
  className,
  position = 'bottom',
  showArrow = true 
}: PopoverProps) {
  return (
    <div className={clsx('relative', className)}>
      {children}
      {showArrow && <Arrow position={position} />}
    </div>
  );
}
