import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  placement = 'top',
  className 
}) => {
  return (
    <Tippy
      content={content}
      placement={placement}
      trigger="mouseenter focus"
      delay={[50, 0]}
      interactive={false}
      className={className}
      hideOnClick={true}
      touch={false}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip; 