// Helper to quickly spin up DOM elements with attributes and event listeners
// TODO: support DocumentFragments for better perf when appending multiple kids
export function el(tagName, attrs = {}, ...children) {
  const element = document.createElement(tagName);

  // Apply attributes and event listeners
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'style' && typeof value === 'object') {
      // Object.assign(element.style, value); -> Quick fix, but might blow up on null values
      for (const [styleName, styleValue] of Object.entries(value)) {
        element.style[styleName] = styleValue;
      }
    } else {
      // Normalizing class assignment
      if (key === 'class' || key === 'className') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  // Append children
  children.forEach(child => {
    if (child === null || child === undefined) {
      return;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else if (Array.isArray(child)) {
      // FIXME: Nested arrays break this if they contain strings instead of elements.
      // Need to make this recursive eventually. For now, we assume it's flat.
      // console.log('DEBUG: child array detected', child);
      child.forEach(nestedChild => {
        if (nestedChild instanceof HTMLElement) {
          element.appendChild(nestedChild);
        }
      });
    } else {
      console.warn('el util: Unsupported child type skipped', child);
    }
  });

  return element;
}

// Quick manual scratchpad test
// TODO: move this to a proper Jest spec file when configuring build tools
/*
const myCard = el('div', { class: 'card', style: { padding: '16px', background: '#eee' } },
  el('h3', {}, 'Title'),
  el('p', {}, 'Some description text here...'),
  el('button', { onClick: () => console.log('clicked!') }, 'Click Me')
);
document.body.appendChild(myCard);
*/