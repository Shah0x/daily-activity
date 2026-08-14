interface ClickOutsideOptions {
  excludeIds?: string[];
  enabled?: boolean;
}

/**
 * Helper to detect clicks outside a given element.
 * Useful for dropdowns, modals, popovers, etc.
 */
export function useClickOutside(
  targetEl: HTMLElement | null,
  callback: (event: PointerEvent) => void,
  options: ClickOutsideOptions = {}
): () => void {
  const { excludeIds = [], enabled = true } = options;

  const handleClick = (event: PointerEvent) => {
    if (!targetEl || !enabled) {
      return;
    }

    // Direct cast for DOM traversal
    const target = event.target as HTMLElement;

    // debug log for weird bubbling issues
    // console.log('click target:', target, 'contains:', targetEl.contains(target));

    if (!target) return;

    // Check if the click was inside the target element
    if (targetEl.contains(target)) {
      return;
    }

    // Check if clicked element (or its parents) matches any excluded IDs
    // TODO: This is a bit brute-force, maybe rewrite using target.closest() for efficiency later?
    const isExcluded = excludeIds.some((id) => {
      const el = document.getElementById(id);
      return el && el.contains(target);
    });

    if (isExcluded) {
      return;
    }

    callback(event);
  };

  // Using pointerdown instead of mousedown/touchstart for better mobile support
  document.addEventListener('pointerdown', handleClick);

  // Return cleanup function to be called on component unmount
  return () => {
    document.removeEventListener('pointerdown', handleClick);
  };
}