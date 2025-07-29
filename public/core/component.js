import BaseComponent from './base-component.js';
import LoadingBar from './loading-bar.js';

/**
 * Base class for building Web Components without Shadow DOM.
 * Handles lifecycle callbacks and rendering via a simple `render()` method.
 */
export default class Component extends BaseComponent {

  /**
   * Loads the CSS file specified by `cssFilePath` and appends it to the document head.
   * If the CSS file is already loaded, it resolves immediately.
   * @returns {Promise<void>}
   */
  addCSS() {
    const ctor = /** @type {typeof Component} */ (this.constructor);

    return new Promise((resolve, reject) => {
      if (!this.cssFilePath || document.querySelector(`#stylesheet-${ctor.name}`)) {
        LoadingBar.hide();
        resolve();
        return;
      }

      LoadingBar.show();

      const stylesheet = document.createElement('link');
      stylesheet.setAttribute('id', `stylesheet-${ctor.name}`);
      stylesheet.setAttribute('rel', 'stylesheet');
      stylesheet.setAttribute('href', this.cssFilePath);

      /**
       * Event handler for stylesheet load.
       */
      const onLoad = () => {
        stylesheet.removeEventListener('load', onLoad);
        stylesheet.removeEventListener('error', onError);
        LoadingBar.hide();
        resolve();
      };

      /**
       * Event handler for stylesheet load error.
       * @param {Event} error
       */
      const onError = (error) => {
        stylesheet.removeEventListener('load', onLoad);
        stylesheet.removeEventListener('error', onError);
        LoadingBar.hide();
        console.error(`Failed to load CSS: ${this.cssFilePath}`, error);
        reject(error);
      }

      stylesheet.addEventListener('load', onLoad);
      stylesheet.addEventListener('error', onError);

      document.head.appendChild(stylesheet);
    });
  }
}