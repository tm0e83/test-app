export default class Component extends EventTarget {
  /** @type {Component[]} */
  #children = [];

  /** @type {HTMLLinkElement} */
  static _stylesheet;

  constructor(parent) {
    super();

    parent?.registerChildComponents(this);
  }

  addCSS() {
    return new Promise((resolve, reject) => {
      if (this.stylesheet && !this.constructor._stylesheet) {
        this.constructor._stylesheet = document.createElement('link');
        this.constructor._stylesheet.setAttribute('rel', 'stylesheet')
        this.constructor._stylesheet.setAttribute('href', this.stylesheet);
        document.head.appendChild(this.constructor._stylesheet);
        this.constructor._stylesheet.addEventListener('load', _ => resolve());
      } else {
        resolve();
      }
    });
  }

  // css() {
  //   const style = document.createElement('style');
  //   style.textContent = [...arguments].flat().join('');
  //   this.element.appendChild(style);
  // }

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

    if (this.constructor._stylesheet) {
      this.constructor._stylesheet.parentElement.removeChild(this.constructor._stylesheet);
      this.constructor._stylesheet = null;
    }
  }
}