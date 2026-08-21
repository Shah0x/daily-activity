class EventEmitter {
  constructor() {
    this._events = {}; // Using plain object for now, maybe Map is better?
  }

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this; // For chaining
  }

  off(event, listener) {
    if (!this._events[event]) return this;

    // TODO: This currently removes all instances of the listener. 
    // Should we only remove the first match? Need to check Node.js spec
    this._events[event] = this._events[event].filter(
      l => l !== listener && l.originalListener !== listener
    );

    return this;
  }

  emit(event, ...args) {
    if (!this._events[event] || this._events[event].length === 0) {
      return false;
    }

    // Clone array to avoid race conditions if a listener calls .off() during execution
    const listeners = [...this._events[event]];
    
    // console.log(`[DEBUG] Emitting "${event}" with args:`, args);

    listeners.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (err) {
        console.error(`Error in listener for event "${event}":`, err);
      }
    });

    return true;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener.apply(this, args);
    };
    
    // Hacky but simple: save reference so .off() can clean it up before it fires
    wrapper.originalListener = listener;
    
    this.on(event, wrapper);
    return this;
  }
}

// --- QUICK MANUAL SANITY TEST ---
const emitter = new EventEmitter();

const onGreet = (name) => console.log(`Hello, ${name}!`);
emitter.on('greet', onGreet);
emitter.once('greet', () => console.log('This should only run once!'));

emitter.emit('greet', 'Alice');
// console.log('--- second emit ---');
emitter.emit('greet', 'Bob');

emitter.off('greet', onGreet);
emitter.emit('greet', 'Charlie'); // Should print nothing