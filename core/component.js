export default class Component extends EventTarget {
  constructor() {
    super();
  }

  css() {
    const style = document.createElement('style');
    style.textContent = [...arguments].join('');
    this.element.appendChild(style);
  }
}