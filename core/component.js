//@ts-check

export default class Component extends EventTarget {
  /** @type {number} */
  static _numInstances = 0;

  /** @type {Component[]} */
  #children = [];

  /** @type {HTMLLinkElement} */
  static _stylesheet;

  constructor(parent) {
    super();

    this.parent = parent;

    /** @type {typeof Component} */
    (this.constructor)._numInstances++;

    this.parent?.registerChildComponents(this);
  }

  /**
   * @method addCSS
   * @param {*} filePath
   * @returns
   */
  addCSS(filePath) {
    if (!filePath) {
      return console.error('missing or empty filePath');
    }

    const ctor = /** @type {typeof Component} */ (this.constructor);

    if (!ctor._stylesheet) {
      ctor._stylesheet = document.createElement('link');
      ctor._stylesheet.setAttribute('rel', 'stylesheet')
      ctor._stylesheet.setAttribute('href', filePath);
      document.head.appendChild(ctor._stylesheet);
    }
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
   */
  destroy() {
    this.#children.forEach(childComponent => childComponent.destroy());

    const ctor = /** @type {typeof Component} */ (this.constructor);
    ctor._numInstances--;

    if (ctor._stylesheet && !ctor._numInstances) {
      ctor._stylesheet.parentElement.removeChild(ctor._stylesheet);
      ctor._stylesheet = null;
    }

    this.dispatchEvent(new CustomEvent('onDestroy'));
  }
}