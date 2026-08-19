class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Register an event listener
   * @param {string} event 
   * @param {Function} listener 
   * @returns {Function} unsubscribe function
   */
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    
    // Return unsubscribe helper directly - super handy in React useEffects
    return () => this.off(event, listener);
  }

  /**
   * Remove an event listener
   */
  off(event, listener) {
    if (!this.events[event]) return;
    
    // REFACTOR NOTE: .filter() creates a new array allocation every time.
    // For high-frequency events, replacing this with indexOf + splice would be faster.
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  /**
   * Trigger all listeners for a given event
   */
  emit(event, ...args) {
    if (!this.events[event]) return;

    // console.log(`[EventEmitter Debug] "${event}" emitted with:`, args);

    // Shallow copy to prevent issues if a listener unsubscribes while we are iterating
    const listeners = [...this.events[event]];
    
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        // Don't let one bad listener crash the whole emit loop
        console.error(`Error in listener for event "${event}":`, error);
      }
    });
  }

  /**
   * Register a listener that fires only once
   */
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    
    // TODO: This breaks .off() if the user tries to remove it using the original listener reference.
    // Need to store original reference on the wrapper function, e.g., wrapper.fn = listener
    return this.on(event, wrapper);
  }
}

// Quick manual verification
const hub = new EventEmitter();

const handleStatusChange = (status) => {
  console.log(`Status changed to: ${status}`);
};

const unsub = hub.on('status', handleStatusChange);
hub.emit('status', 'connecting'); // prints: Status changed to: connecting

unsub();
hub.emit('status', 'connected'); // nothing happens (correct)

hub.once('temp_event', (val) => console.log('Once:', val));
hub.emit('temp_event', 'first');  // prints 'Once: first'
hub.emit('temp_event', 'second'); // nothing happens (correct)