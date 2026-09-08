import React from 'react';

export interface ViewportContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ViewportContainer: React.FC<ViewportContainerProps> = ({
  children,
  className = '',
  id = 'viewport-container',
}) => {
  return (
    <div
      id={id}
      className={`w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-32 min-h-screen flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};
