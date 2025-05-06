import Component from '/core/component.js';

export default class PageNotFound extends Component {
  constructor() {
    super();
  }

  get template() {
    return /*html*/ `
      <h1>Seite nicht gefunden 8-(</h1>
    `;
  }
}

customElements.define('page-not-found', PageNotFound);