// scrollspy.js
// TODO: Need to handle window resize if sections are dynamic.
// For now, it assumes static section offsets.

export function initScrollSpy(navSelector, sectionSelector, options = {}) {
  const navLinks = document.querySelectorAll(navSelector);
  const sections = document.querySelectorAll(sectionSelector);

  if (!navLinks.length || !sections.length) {
    console.warn('ScrollSpy: No links or sections found.');
    return;
  }

  const defaultOptions = {
    root: null,
    // Trigger when section occupies the upper-middle of viewport
    rootMargin: '-20% 0px -60% 0px', 
    threshold: 0,
    activeClass: 'active',
    ...options
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      // debug log left in for testing intersection behaviors
      // console.log('entry intersect:', entry.target.id, entry.isIntersecting); 
      
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          
          // FIXME: endsWith is a bit fragile if href has trailing slashes or query params.
          // Works fine for local hashes like '#features' though.
          if (href && href.endsWith(`#${id}`)) {
            link.classList.add(defaultOptions.activeClass);
          } else {
            link.classList.remove(defaultOptions.activeClass);
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, defaultOptions);

  sections.forEach(section => {
    if (!section.getAttribute('id')) {
      console.error('ScrollSpy: Section is missing an ID attribute!', section);
    } else {
      observer.observe(section);
    }
  });

  // Return destroyer function to prevent memory leaks in single page apps
  return () => {
    observer.disconnect();
  };
}

// Quick manual test stub
// TODO: Move this to a proper test suite later
// const cleanup = initScrollSpy('.nav-link', 'section.scroll-target');