import Component from '/core/component.js';

export default class Footer extends Component {
  cssFilePath = '/layout/standard/layout-footer.css';

  constructor() {
    super();
  }

  get template() {
    return /*html*/ `
      <footer>
        &copy; eWorks GmbH
      </footer>
    `;
  }
}