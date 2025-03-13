export default class Component extends EventTarget {
  /** @type {Component[]} */
  #children = [];

  constructor(parent) {
    super();
    // parent?.registerChildComponents(this);
  }

  css() {
    const style = document.createElement('style');
    style.textContent = [...arguments].join('');
    this.element.appendChild(style);
  }

  /**
   * Registers one or multiple components as children of this component.
   * @param  {...Component} components
   */
  registerChildComponents(...components) {
    this.#children.push(...components);
  }

  /**
   * Destroys all child component and then removes the components root element from DOM.
   * ! Should be overwritten in concrete component implementation if component has any state subscriptions.
   */
  destroy() {
    this.dispatchEvent('beforeDestroy');
    this.#children.forEach((c) => c.destroy());
    this.element.remove();
  }
}