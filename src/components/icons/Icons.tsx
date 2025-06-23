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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
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

export const ImportIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const MenuIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const PencilIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const SingleBoxIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

export const MultipleBoxIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2" ry="2" strokeDasharray="4 4" />
    <path d="M4 16V4c0-1.1.9-2 2-2h10" strokeDasharray="4 4"/>
  </svg>
);

export const AreaIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

export const RectangleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

export const CellsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="9" y="14" width="6" height="6" rx="1" />
  </svg>
);

export const RotateLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 6.219-8.56" />
    <polyline points="3 3 3 7 7 7" />
  </svg>
);

export const RotateRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <polyline points="21 3 21 7 17 7" />
  </svg>
);

export const FlipHorizontalIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V2M3 12l4 4V8l-4 4zM21 12l-4-4v8l4-4z"/>
  </svg>
);

export const FlipVerticalIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20M12 3l-4 4h8l-4-4zM12 21l4-4H8l4 4z"/>
  </svg>
); 

export const AspectIcon: React.FC<IconProps> = ({ className, style }) => (
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
    {/* Center rectangle */}
    <rect x="8" y="6" width="8" height="12" rx="1" />
    {/* Diagonal arrows pointing outward */}
    <path d="M2 2l4 4M2 2l4 0M2 2l0 4" />
    <path d="M22 2l-4 4M22 2l-4 0M22 2l0 4" />
    <path d="M2 22l4-4M2 22l4 0M2 22l0-4" />
    <path d="M22 22l-4-4M22 22l-4 0M22 22l0-4" />
  </svg>
); 