interface DelegateOptions {
  capture?: boolean;
}

// TODO: Figure out a cleaner way to type-safe the delegated event target.
// Right now, EventTarget doesn't have the properties of the selector element unless cast.
export function delegate<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  parent: HTMLElement | Document,
  selector: string,
  eventType: K,
  handler: (event: HTMLElementEventMap[K], matchedTarget: T) => void,
  options?: DelegateOptions
): () => void {
  const listener = (event: Event) => {
    const target = event.target as HTMLElement;
    
    // Fallback if target is somehow null (e.g. detached elements)
    if (!target) return;

    const matchedTarget = target.closest(selector) as T | null;

    // console.log('Delegate match check:', { target, matchedTarget, selector }); // debug junk, remove before PR

    if (matchedTarget && parent.contains(matchedTarget)) {
      // Cast the generic Event to the specific event map type
      handler(event as HTMLElementEventMap[K], matchedTarget);
    }
  };

  parent.addEventListener(eventType, listener, options?.capture);

  // Return cleanup function to prevent memory leaks
  // FIXME: If parent is removed from DOM, does this callback still leak if referenced?
  return () => {
    parent.removeEventListener(eventType, listener, options?.capture);
  };
}

// Quick manual test/example usage:
// const destroy = delegate<"click", HTMLButtonElement>(
//   document.body,
//   "button.action-btn",
//   "click",
//   (e, btn) => {
//     console.log("Clicked button with text:", btn.textContent);
//     // e.preventDefault();
//   }
// );