import Component from '/core/component.js';

export default class LayoutFooter extends Component {
  cssFilePath = '/components/layouts/standard/layout-footer/layout-footer.css';

  get template() {
    return /*html*/ `
      <footer>
        <div class="d-flex gap-4 justify-content-end">
          <a href="#">Link 1</a>
          <a href="#">Link 2</a>
          <a href="#">Link 3</a>
        </div>
      </footer>
    `;
  }
}

customElements.define('layout-footer', LayoutFooter);