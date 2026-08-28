// Helper to delegate events to dynamically added children
// TODO: Need to add a way to teardown/remove this listener later. Maybe return a cleanup function?
export function delegate(parentElement, eventType, selector, callback) {
  // Just in case selector is passed as a DOM node by mistake
  if (typeof selector !== 'string') {
    throw new Error('Selector must be a string query');
  }

  const listener = function(event) {
    // Find the closest ancestor matching the selector starting from the target
    const potentialTarget = event.target.closest(selector);
    
    // Ensure the matched element is actually within the parent container
    if (potentialTarget && parentElement.contains(potentialTarget)) {
      // console.log('Delegation match found:', potentialTarget); // debug nested clicks
      
      // Bind "this" to the element, matching standard EventListener behavior
      callback.call(potentialTarget, event);
    }
  };

  // Note: capturing might be needed for focus/blur events. Add options param later?
  parentElement.addEventListener(eventType, listener);

  // Quick refactor idea: return destroy function to make cleanup painless
  return () => {
    parentElement.removeEventListener(eventType, listener);
  };
}

// Sandbox test code (to be removed before PR)
/*
const list = document.querySelector('#todo-list');
if (list) {
  const removeDelegate = delegate(list, 'click', '.delete-btn', function(e) {
    e.preventDefault();
    console.log('Deleting item:', this.dataset.id);
    // this.closest('li').remove();
  });
  
  // removeDelegate(); // seems to work fine
}
*/