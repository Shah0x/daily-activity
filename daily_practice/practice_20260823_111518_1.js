// TODO: Add a 'cancel' or 'flush' method to the returned function for better control in SPA lifecycles.
// Refactor note: Might be worth switching to arrow functions to avoid 'const context = this' wrapping,
// but need to make sure we don't break dynamic binding if used in object methods.

function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      // console.log('debounce timer finished, executing callback'); // dbg
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    // Clear the timeout if it's already queued
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

// Quick manual test/example usage:
/*
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

const input = document.querySelector('#search-box');
if (input) {
  input.addEventListener('input', (e) => handleSearch(e.target.value));
} else {
  console.warn('Search box element not found, skipping event binding.');
}
*/