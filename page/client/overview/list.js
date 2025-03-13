import Component from '/core/component.js';
import Client from './client.js';

export default class Overview extends Component {
  constructor(parent, element, data) {
    super(parent, element, data);

    this.parent = parent;
    this.data = data;
    this.element = element;

    this.render(this.data);
  }

  render(data) {
    this.data = data;
    this.element.innerHTML = this.template;

    this.data.map(clientData => {
      const clientElement = document.createElement('div');
      this.element.appendChild(clientElement);

      new Client({
        parent: this,
        data: clientData,
        element: clientElement
      });
    });
  }

  onDelete(id) {
    this.parent.onDelete(id);
  }

  get template() {
    return /*html*/ `${this.data.length ? '': i18next.t('noResults')}`;
  }
}