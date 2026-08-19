// Helper to delegate events to dynamically added child elements
// TODO: Need to implement support for multiple event types (space-separated string?)
export function delegate(parent, eventType, childSelector, callback) {
  const parentEl = typeof parent === 'string' 
    ? document.querySelector(parent) 
    : parent;

  if (!parentEl) {
    console.warn(`Delegate target parent not found for: ${parent}`);
    return null;
  }

  const listener = function(event) {
    // Find the closest matching child selector (handles nested elements like <span> inside <button>)
    const potentialTarget = event.target.closest(childSelector);
    
    // Ensure the matched element is actually inside the parent boundary
    if (potentialTarget && parentEl.contains(potentialTarget)) {
      // console.log('Delegate match found:', potentialTarget); // debug log
      
      // Bind "this" to the target, passing event and the matching element
      callback.call(potentialTarget, event, potentialTarget);
    }
  };

  parentEl.addEventListener(eventType, listener);

  // Return teardown function for clean-up
  // FIXME: Memory leak risk if parentEl is removed from DOM but reference is kept in closure?
  // Should probably explore AbortSignal/AbortController API here for ES6+
  return () => {
    parentEl.removeEventListener(eventType, listener);
  };
}

// Quick manual test / scratchpad (commented out for imports)
/*
const removeDelegate = delegate('#todo-list', 'click', '.delete-btn', function(e, target) {
  e.preventDefault();
  const todoId = target.dataset.id;
  console.log(`Deleting todo item: ${todoId}`);
  // this.parentElement.remove(); // "this" points to .delete-btn
});

// later...
// removeDelegate();
*/