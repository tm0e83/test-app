import Component from '/core/component.js';
import Client from './client.js';

export default class Overview extends Component {
  constructor(parent, data) {
    super(parent, data);

    this.data = data;
    this.element = document.createElement('div');
    this.element.classList.add('client-list');
    this.render = this.render.bind(this);

    this.render(this.data);
  }

  render(data) {
    this.data = data;
    this.element.innerHTML = this.template;

    this.data.map(clientData => {
      this.element.appendChild((new Client(this, clientData)).element);
    });
  }

  get template() {
    return /*html*/ `${this.data.length ? '': i18next.t('noResults')}`;
  }

  onDelete(id) {
    this.parent.onDelete(id);
  }
}