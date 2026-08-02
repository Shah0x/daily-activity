// Debounce helper for rate-limiting expensive operations like window resizing or search inputs.
// TODO: Figure out if we should return a Promise for the immediate execution path?
export function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function() {
      timeout = null;
      // console.log('debounce: executing later', args); // debug log
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    // Standard cleanup: cancel any pending timeouts
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      // console.log('debounce: executing immediate');
      func.apply(context, args);
    }
  };
}

// FIXME: This works fine, but does it leak memory if the component unmounts?
// Might need to return a cancel() method on the returned function.
// Note to self: look at lodash's implementation for reference next time.

/* Usage Example:
const searchInput = document.querySelector('#search');
if (searchInput) {
  searchInput.addEventListener('input', debounce((e) => {
    // fetch results...
    console.log('Searching for:', e.target.value);
  }, 300));
}
*/