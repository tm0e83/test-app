/**
 * @class
 * @description creates a event bus that manages action subscriptions
 * @method subscribe
 * @method unsubscribe
 * @method publish
 * @example
  const eventbus = new EventBus();
  eventbus.susbcribe('sayHello', _ => {
    console.log('Hello');
  });

  eventbus.publish('sayHello'); // "Hello"
*/
export default class EventBus {
  constructor() {
    this.channels = [];
  }

  /**
   * susbcribe to an action
   * @param {string} action the identifier of the action
   * @param {function} fn callback function
   * @param {object} options
   */
  subscribe(action, fn, options = {}) {
    if (typeof action != 'string' || typeof fn != 'function') return false;
    if (!this.channels[action]) this.channels[action] = [];
    if (options.id) this.unsubscribe(action, options.id);
    this.channels[action].push({
      fn: fn,
      id: options.id || null
    });
    return this;
  }

  unsubscribe(action, id) {
    if (typeof action != 'string' || !id) return false;
    if (!this.channels[action]) return this;
    this.channels[action] = this.channels[action].filter(subscriber => subscriber.id !== id);
    return this;
  }

  /**
   * publish an action
   * @param {string} action the identifier of the action
   */
  publish(action) {
    if (!this.channels[action]) return false;
    const args = Array.prototype.slice.call(arguments, 1);
    this.channels[action].forEach(subscriber => subscriber.fn(...args));
    return this;
  }
}