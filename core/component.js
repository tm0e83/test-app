//@ts-check

import { i18n } from '/i18n/i18n.js';

/**
 * Base class for building Web Components without Shadow DOM.
 * Handles lifecycle callbacks and rendering via a simple `render()` method.
 */
export default class Component extends HTMLElement {
  /** @type {number} */
  static _numInstances = 0;

  /** @type {HTMLLinkElement} */
  static _stylesheet;

  /** @type {string} */
  cssFilePath = null;

  constructor() {
    super();

    /** @type {typeof Component} */
    (this.constructor)._numInstances++;

    this.render = this.render.bind(this);
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when the element is inserted into the DOM.
   * Triggers the initial render.
   * Subclasses may override this method to perform additional setup.
   */
  connectedCallback() {
    this.addCSS();
    this.render();
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when the elemeted is removed from the DOM.
   * Subclasses may override this method to perform cleanup.
   */
  disconnectedCallback() {
    const ctor = /** @type {typeof Component} */ (this.constructor);
    ctor._numInstances--;

    if (ctor._stylesheet && !ctor._numInstances) {
      ctor._stylesheet.parentElement.removeChild(ctor._stylesheet);
      ctor._stylesheet = null;
    }
  }

  /**
   * Lifecycle callback of Web Components / Custom Elements API: Called when one of the element's observed attributes is changed.
   * Subclasses should define `static get observedAttributes()` to use this.
   * @param {string} name - The name of the attribute.
   * @param {string|null} oldValue - The old value of the attribute.
   * @param {string|null} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * @method addCSS
   * @returns
   */
  addCSS() {
    if (!this.cssFilePath) return;

    const ctor = /** @type {typeof Component} */ (this.constructor);

    if (!ctor._stylesheet) {
      ctor._stylesheet = document.createElement('link');
      ctor._stylesheet.setAttribute('rel', 'stylesheet')
      ctor._stylesheet.setAttribute('href', this.cssFilePath);
      document.head.appendChild(ctor._stylesheet);
    }
  }

  /**
   * Render the component's content. Subclasses may override this method.
   */
  render() {
    this.innerHTML = this.template;
  }

  /**
   * The HTML template of this component. Subclasses must override this method.
   * @returns {string}
   */
  get template() {
    throw new Error('This must be implemented by subclasses of BaseComponent!');
  }
}