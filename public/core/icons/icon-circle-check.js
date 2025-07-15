import BaseIcon from '/core/icons/base-icon.js';

/**
 * A component that renders an SVG icon representing a circle with a check mark.
 */
export default class IconCircleCheck extends BaseIcon {
  get template() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
    `
  }
}

customElements.define('icon-circle-check', IconCircleCheck);