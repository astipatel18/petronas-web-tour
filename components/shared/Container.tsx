// components/shared/Container.tsx
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * CONTAINER COMPONENT (Server-Side)
 * --------------------------------
 * This is a foundational UI component designed to be a "Server Component".
 * It handles the responsive max-width constraints of the application
 * without introducing client-side overhead or serialization mismatches.
 */

interface ContainerProps {
  /** The content to be wrapped inside the container */
  children: React.ReactNode;
  /** Additional Tailwind CSS classes for custom spacing/styling */
  className?: string;
  /** 
   * Change the HTML element type. 
   * Useful for SEO (e.g., using 'section', 'article', or 'header').
   * Defaults to 'div'.
   */
  as?: React.ElementType;
}

export const Container = ({ 
  children, 
  className,
  as: Tag = 'div' // Renamed to 'Tag' for clearer React semantic rendering
}: ContainerProps) => {
  return (
    <Tag 
      className={cn(
        // Base constraints for a world-class responsive layout
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full", 
        // Allows custom overrides while maintaining the base structure
        className
      )}
    >
      {children}
    </Tag>
  );
};