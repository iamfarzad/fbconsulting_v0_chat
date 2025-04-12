import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

interface FocusTrapResult {
  /** Activates the focus trap within the referenced container */
  trap: () => Promise<void>;
  /** Deactivates the focus trap and restores normal focus behavior */
  release: () => Promise<void>;
}

/**
 * A React hook that manages focus trapping within a container element.
 * Useful for modals, dialogs, and other elements that should trap focus for accessibility.
 *
 * @param ref - A React ref pointing to the container element where focus should be trapped
 * @returns An object with trap and release functions to control the focus trap
 *
 * @example
 * ```tsx
 * const dialogRef = useRef<HTMLDivElement>(null);
 * const { trap, release } = useFocusTrap(dialogRef);
 *
 * useEffect(() => {
 *   if (isOpen) {
 *     trap();
 *     return () => release();
 *   }
 * }, [isOpen]);
 * ```
 */
export function useFocusTrap(ref: RefObject<HTMLElement>): FocusTrapResult {
  const getFocusableElements = useCallback(() => {
    if (!ref.current) return [];
    return Array.from(
      ref.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, [ref]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements],
  );

  const trap = useCallback(async () => {
    try {
      document.addEventListener('keydown', handleKeyDown);
      const elements = getFocusableElements();
      if (elements.length > 0) {
        (elements[0] as HTMLElement).focus();
      }
    } catch (error) {
      console.error('Error activating focus trap:', error);
    }
  }, [handleKeyDown, getFocusableElements]);

  const release = useCallback(async () => {
    try {
      document.removeEventListener('keydown', handleKeyDown);
    } catch (error) {
      console.error('Error releasing focus trap:', error);
    }
  }, [handleKeyDown]);

  // Cleanup event listener on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { trap, release };
}
