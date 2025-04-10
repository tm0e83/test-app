import Component from '/core/component.js';

export default class PageNotFound extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('file-not-found');

    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Seite nicht gefunden 8-(</h1>
    `;
  }
}