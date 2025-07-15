import BaseComponent from './base-component.js';
import LoadingBar from './loading-bar.js';

/**
 * Base class for building Web Components without Shadow DOM.
 * Handles lifecycle callbacks and rendering via a simple `render()` method.
 */
export default class Component extends BaseComponent {
  constructor() {
    super();
  }

  /**
   * @param {Event} event
   */
  onStylesheetLoad(event) {
    LoadingBar.hide();
    console.log('stylrsheet geladen', this.constructor.name);
  }

  /**
   * @method addCSS
   * @returns
  */
  async addCSS() {
    if (!this.cssFilePath) return;
    LoadingBar.show();
    return super.addCSS();
  }
}