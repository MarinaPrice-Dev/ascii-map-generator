import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const UndoIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10h10a5 5 0 0 1 5 5v3" />
    <path d="M3 10l6-6" />
    <path d="M3 10l6 6" />
  </svg>
);

export const RedoIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10H11a5 5 0 0 0-5 5v3" />
    <path d="M21 10l-6-6" />
    <path d="M21 10l-6 6" />
  </svg>
);

export const ClearIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={className}
    style={style}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const ZoomInIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const ZoomOutIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
); 